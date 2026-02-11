import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Alert, Linking, ActivityIndicator, StatusBar, Image as RNImage, Vibration } from 'react-native';
import { CameraView, CameraType, FlashMode, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuiz } from '../src/context/QuizContext';
import { useScan } from '../src/context/ScanContext';
import { supabaseUrl, supabaseAnonKey } from '../src/lib/supabase';

const { width, height } = Dimensions.get('window');

// Colors
const COLORS = {
  white: '#FFFFFF',
  black: '#000000',
  berryRed: '#ee2b5b',
  gray800: '#1F2937',
  gray500: '#6B7280',
  overlay: 'rgba(0,0,0,0.5)',
};

const toNumber = (value: unknown) => {
  const n = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
  return Number.isFinite(n) ? n : undefined;
};

const pickNutriment = (nutriments: Record<string, unknown>, keyBase: string, variant: 'serving' | '100g') => {
  return toNumber(nutriments[`${keyBase}_${variant}`]);
};

const fetchBarcodeNutrition = async (barcode: string) => {
  const res = await fetch(
    `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json?fields=product_name,product_name_pt,brands,image_front_url,image_url,serving_size,nutriments,status`,
  );

  if (!res.ok) {
    return { ok: false as const };
  }

  const json = (await res.json()) as any;
  if (json?.status !== 1 || !json?.product) {
    return { ok: false as const };
  }

  const product = json.product as any;
  const nutriments = (product.nutriments ?? {}) as Record<string, unknown>;

  const hasServing =
    typeof product.serving_size === 'string' &&
    product.serving_size.trim().length > 0 &&
    (pickNutriment(nutriments, 'energy-kcal', 'serving') != null ||
      pickNutriment(nutriments, 'proteins', 'serving') != null ||
      pickNutriment(nutriments, 'carbohydrates', 'serving') != null ||
      pickNutriment(nutriments, 'fat', 'serving') != null);

  const variant: 'serving' | '100g' = hasServing ? 'serving' : '100g';

  const calories =
    pickNutriment(nutriments, 'energy-kcal', variant) ??
    (variant === '100g' ? toNumber(nutriments['energy-kcal_100g']) : undefined);

  const protein = pickNutriment(nutriments, 'proteins', variant);
  const carbs = pickNutriment(nutriments, 'carbohydrates', variant);
  const fat = pickNutriment(nutriments, 'fat', variant);

  const fiber = pickNutriment(nutriments, 'fiber', variant);
  const sugar = pickNutriment(nutriments, 'sugars', variant);
  const salt = pickNutriment(nutriments, 'salt', variant);
  const sodium = pickNutriment(nutriments, 'sodium', variant);
  const saturatedFat = pickNutriment(nutriments, 'saturated-fat', variant);

  const name =
    (typeof product.product_name_pt === 'string' && product.product_name_pt.trim()) ||
    (typeof product.product_name === 'string' && product.product_name.trim()) ||
    'Alimento não identificado';

  const imageUri =
    (typeof product.image_front_url === 'string' && product.image_front_url) ||
    (typeof product.image_url === 'string' && product.image_url) ||
    undefined;

  const brand =
    (typeof product.brands === 'string' && product.brands.trim()) ? product.brands.trim() : undefined;

  const quantityLabel = hasServing ? (product.serving_size as string) : '100g';

  return {
    ok: true as const,
    payload: {
      name,
      calories: calories ?? 0,
      protein: protein ?? 0,
      carbs: carbs ?? 0,
      fat: fat ?? 0,
      imageUri,
      fiber,
      sugar,
      salt,
      sodium,
      saturatedFat,
      quantityLabel,
      brand,
      source: 'openfoodfacts',
      isFood: 'true' as const,
    },
  };
};

export default function ScannerScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('off');
  const [activeTab, setActiveTab] = useState('scan_food');
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scanned, setScanned] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const { isQuizCompleted } = useQuiz();
  const { setPendingScan } = useScan();

  // Tabs configuration
  const TABS = [
    { key: 'scan_food', label: 'Escanear', icon: 'nutrition' }, // using ionicons names mapped later
    { key: 'barcode', label: 'Cód. Barras', icon: 'barcode' },
    { key: 'food_label', label: 'Rótulo', icon: 'pricetag' },
    { key: 'library', label: 'Galeria', icon: 'images', action: 'open_gallery' },
  ];

  // Request permission on mount
  useEffect(() => {
    if (permission && !permission.granted && !permission.canAskAgain) {
        // Permission denied/blocked previously
    } else if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash(current => (current === 'off' ? 'on' : current === 'on' ? 'auto' : 'off'));
  };

  const handleBarcodeScanned = ({ type, data }: BarcodeScanningResult) => {
    if (scanned || activeTab !== 'barcode') return;
    
    setScanned(true);
    Vibration.vibrate();
    
    setIsCapturing(true);

    const run = async () => {
      try {
        const barcode = String(data ?? '').trim();
        if (!barcode) {
          throw new Error('barcode_empty');
        }

        const result = await fetchBarcodeNutrition(barcode);

        const scanResult = result.ok
          ? result.payload
          : {
              name: 'Não foi possível identificar',
              calories: 0,
              protein: 0,
              carbs: 0,
              fat: 0,
              isFood: 'false' as const,
              source: 'barcode',
            };

        if (isQuizCompleted) {
          router.push({
            pathname: '/ScanResultScreen',
            params: scanResult as any,
          });
        } else {
          setPendingScan(scanResult as any);
          router.push('/diet-onboarding');
        }
      } catch (e) {
        const scanResult = {
          name: 'Não foi possível identificar',
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          isFood: 'false' as const,
          source: 'barcode',
        };

        if (isQuizCompleted) {
          router.push({
            pathname: '/ScanResultScreen',
            params: scanResult as any,
          });
        } else {
          setPendingScan(scanResult as any);
          router.push('/diet-onboarding');
        }
      } finally {
        setIsCapturing(false);
        setTimeout(() => setScanned(false), 2000);
      }
    };

    run();
  };

  const handleCapture = async () => {
    if (!cameraRef.current || isCapturing) return;

    if (activeTab === 'barcode') {
        // Manual trigger if needed, or ignore
        return;
    }

    try {
      setIsCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });
      
      if (photo?.uri) {
        if (activeTab === 'food_label') {
            processFoodLabel(photo.uri);
        } else {
            processImage(photo.uri);
        }
      }
    } catch (error) {
      console.error("Capture failed:", error);
      Alert.alert("Erro", "Falha ao tirar foto. Tente novamente.");
      setIsCapturing(false);
    }
  };

  const pickImage = async () => {
    // Check gallery permissions if needed, but usually granted by default or handled by OS picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false, // Full screen analysis usually prefers uncropped
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
      processImage(result.assets[0].uri);
    }
  };

  const processFoodLabel = (uri: string) => {
      setCapturedImage(uri);
      // Simulate OCR processing
      setTimeout(() => {
          setIsCapturing(false);
          setCapturedImage(null);
          
          const scanResult = {
              imageUri: uri,
              name: "Iogurte Grego Natural",
              calories: 120,
              protein: 10,
              carbs: 5,
              fat: 6,
              isFood: 'true' as const,
              source: 'label',
          };

          if (isQuizCompleted) {
              router.push({
                  pathname: '/ScanResultScreen',
                  params: scanResult
              });
          } else {
              setPendingScan(scanResult);
              router.push('/diet-onboarding');
          }
      }, 2000);
  };

  const analyzeFood = async (uri: string, signal?: AbortSignal) => {
    let base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: 'base64',
    });

    // Ensure base64 is pure (remove prefix if present)
    if (base64.startsWith('data:image')) {
        base64 = base64.split(',')[1];
    }

    const response = await fetch(`${supabaseUrl}/functions/v1/analyze-food`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'apikey': supabaseAnonKey,
      },
      body: JSON.stringify({ imageBase64: base64 }),
      signal,
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || `Erro da IA (${response.status})`);
      } catch (e: any) {
        // If it was already the error we threw, rethrow it
        if (e.message && e.message.includes('Erro da IA')) throw e;
        throw new Error(`Falha na comunicação com a IA (${response.status})`);
      }
    }

    return await response.json();
  };

  const processImage = async (uri: string) => {
    setCapturedImage(uri);
    setIsCapturing(true);

    // Timeout de 25 segundos
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    try {
      const data = await analyzeFood(uri, controller.signal);
      clearTimeout(timeoutId);
      
      let scanResult;

      if (data.isFood === false) {
         scanResult = {
            imageUri: uri,
            name: "Não identificado",
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            isFood: 'false' as const,
            source: 'image',
            confidence: data.confidence,
            notes: data.notes || "Não foi possível identificar alimentos na imagem.",
         };
      } else {
         scanResult = {
            imageUri: uri,
            name: data.items && data.items.length > 0 ? data.items[0].name : "Alimento Identificado",
            calories: data.total?.kcal || 0,
            protein: data.total?.protein_g || 0,
            carbs: data.total?.carbs_g || 0,
            fat: data.total?.fat_g || 0,
            isFood: 'true' as const,
            source: 'image',
            confidence: data.confidence,
            ingredients: JSON.stringify(data.items.map((item: any) => ({
                name: item.name,
                portionLabel: item.estimated_grams ? `${item.estimated_grams}g` : 'Porção estimada',
                calories: item.kcal
            })))
         };
      }

      setCapturedImage(null);
      
      if (isQuizCompleted) {
          router.push({
              pathname: '/ScanResultScreen',
              params: scanResult as any
          });
      } else {
          setPendingScan(scanResult as any);
          router.push('/diet-onboarding');
      }

    } catch (error: any) {
       clearTimeout(timeoutId);
       console.error("Analysis failed:", error);
       
       let errorMessage = "Não foi possível analisar a imagem. Tente novamente.";
       
       if (error.name === 'AbortError' || error.message?.includes('aborted')) {
           errorMessage = "A análise demorou muito. Verifique sua conexão.";
       } else if (error.message) {
           errorMessage = error.message;
       }

       Alert.alert("Erro", errorMessage);
       setCapturedImage(null);
    } finally {
       setIsCapturing(false);
    }
  };

  const handleTabPress = (tab: typeof TABS[0]) => {
    if (tab.action === 'open_gallery') {
      pickImage();
    } else {
      setActiveTab(tab.key);
      setScanned(false); // Reset barcode scan state
    }
  };

  const getOverlayText = () => {
      switch(activeTab) {
          case 'barcode': return "Aponte para o código de barras";
          case 'food_label': return "Enquadre a tabela nutricional";
          default: return "";
      }
  };

  // Render Permission States
  if (!permission) {
    // Camera permissions are still loading.
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.permissionContainer]}>
        <StatusBar barStyle="dark-content" />
        <MaterialIcons name="no-photography" size={64} color={COLORS.gray500} />
        <Text style={styles.permissionTitle}>Permissão necessária</Text>
        <Text style={styles.permissionText}>
          {permission.canAskAgain 
            ? "A câmera é necessária para escanear alimentos e calcular calorias automaticamente."
            : "O acesso à câmera está bloqueado. Por favor, ative nas configurações do seu dispositivo."}
        </Text>
        
        <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={permission.canAskAgain ? requestPermission : () => Linking.openSettings()}
        >
          <Text style={styles.primaryButtonText}>
            {permission.canAskAgain ? "Permitir Câmera" : "Abrir Configurações"}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryButton} onPress={pickImage}>
          <Text style={styles.secondaryButtonText}>Usar Galeria</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tertiaryButton} onPress={() => router.back()}>
          <Text style={styles.tertiaryButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Camera View */}
      {capturedImage ? (
         <RNImage source={{ uri: capturedImage }} style={StyleSheet.absoluteFill} />
      ) : (
        <CameraView 
            ref={cameraRef}
            style={StyleSheet.absoluteFill} 
            facing={facing}
            flash={flash}
            mode="picture"
            onBarcodeScanned={activeTab === 'barcode' ? handleBarcodeScanned : undefined}
            barcodeScannerSettings={{
                barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e", "qr"],
            }}
        />
      )}

      {/* Loading Overlay */}
      {isCapturing && (
          <BlurView intensity={20} tint="dark" style={[StyleSheet.absoluteFill, styles.loadingOverlay]}>
              <ActivityIndicator size="large" color={COLORS.white} />
              <Text style={styles.loadingText}>Analisando...</Text>
          </BlurView>
      )}

      {/* UI Overlay */}
      <SafeAreaView style={styles.uiContainer}>
        
        {/* Top Bar */}
        <View style={styles.topBar}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <MaterialIcons name="arrow-back" size={24} color={COLORS.black} />
            </TouchableOpacity>
            <Text style={styles.screenTitle}>Scanner</Text>
            <View style={{ width: 40 }} /> 
        </View>

        {/* Middle - Scan Frame */}
        <View style={styles.frameContainer}>
             {getOverlayText() ? (
                <View style={styles.hintContainer}>
                    <Text style={styles.hintText}>{getOverlayText()}</Text>
                </View>
             ) : null}
             <View style={[styles.scanFrame, activeTab === 'food_label' && { height: width * 0.5 }]}>
                 {/* Corners */}
                 <View style={[styles.corner, styles.cornerTL]} />
                 <View style={[styles.corner, styles.cornerTR]} />
                 <View style={[styles.corner, styles.cornerBL]} />
                 <View style={[styles.corner, styles.cornerBR]} />
             </View>
        </View>

        {/* Bottom Controls */}
        <View style={styles.bottomContainer}>
            
            {/* Tabs */}
            <View style={styles.tabsRow}>
                {TABS.map((tab) => (
                    <TouchableOpacity 
                        key={tab.key} 
                        style={[styles.tabItem, activeTab === tab.key && styles.tabItemActive]}
                        onPress={() => handleTabPress(tab)}
                    >
                         <View style={[styles.tabIconContainer, activeTab === tab.key && styles.tabIconActive]}>
                            {tab.key === 'scan_food' && <MaterialCommunityIcons name="food-apple-outline" size={24} color={activeTab === tab.key ? COLORS.black : COLORS.white} />}
                            {tab.key === 'barcode' && <MaterialCommunityIcons name="barcode-scan" size={24} color={activeTab === tab.key ? COLORS.black : COLORS.white} />}
                            {tab.key === 'food_label' && <MaterialCommunityIcons name="label-outline" size={24} color={activeTab === tab.key ? COLORS.black : COLORS.white} />}
                            {tab.key === 'library' && <MaterialIcons name="photo-library" size={24} color={activeTab === tab.key ? COLORS.black : COLORS.white} />}
                         </View>
                         <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>
                             {tab.label}
                         </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Actions */}
            <View style={styles.controlsRow}>
                <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
                     <MaterialIcons name="flip-camera-ios" size={24} color={COLORS.black} />
                </TouchableOpacity>

                {activeTab !== 'barcode' ? (
                    <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
                        <View style={styles.captureInner} />
                    </TouchableOpacity>
                ) : (
                    <View style={{ width: 80, height: 80 }} /> // Spacer to keep layout
                )}

                <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
                    <MaterialIcons name={flash === 'on' ? "flash-on" : flash === 'auto' ? "flash-auto" : "flash-off"} size={24} color={COLORS.black} />
                </TouchableOpacity>
            </View>

        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  permissionContainer: {
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.gray800,
    marginTop: 20,
    marginBottom: 10,
  },
  permissionText: {
    fontSize: 16,
    color: COLORS.gray500,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  primaryButton: {
    backgroundColor: COLORS.berryRed,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: COLORS.berryRed,
    fontSize: 16,
    fontWeight: '600',
  },
  tertiaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  tertiaryButtonText: {
    color: COLORS.gray500,
    fontSize: 16,
    fontWeight: '600',
  },
  uiContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
  },
  frameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
  },
  scanFrame: {
    width: width * 0.8,
    height: width * 0.8,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: COLORS.white,
    borderWidth: 4,
    borderRadius: 8,
  },
  cornerTL: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  cornerTR: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  cornerBL: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  cornerBR: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  
  bottomContainer: {
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 30,
  },
  tabItem: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
    minWidth: 70,
  },
  tabItemActive: {
    backgroundColor: COLORS.white,
  },
  tabIconContainer: {
    marginBottom: 4,
  },
  tabIconActive: {
    // color handled in icon prop
  },
  tabLabel: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: COLORS.black,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: COLORS.white,
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.white,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  loadingText: {
    color: COLORS.white,
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
  },
  hintContainer: {
    position: 'absolute',
    top: -60,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  hintText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
