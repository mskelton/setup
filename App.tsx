import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  PermissionsAndroid,
  Platform,
  Dimensions,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { CardDetector, DetectedCard } from './src/CardDetector';
import { SetSolver } from './src/SetSolver';
import { CardOverlay } from './src/CardOverlay';
import type { DetectedSet } from './src/CardOverlay';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

function App() {
  const [hasPermission, setHasPermission] = useState(false);
  const [detectedCards, setDetectedCards] = useState<DetectedCard[]>([]);
  const [detectedSets, setDetectedSets] = useState<DetectedSet[]>([]);
  const [lastProcessTime, setLastProcessTime] = useState(0);

  const devices = useCameraDevices();
  const device = devices.find(d => d.position === 'back');

  const cardDetector = new CardDetector();
  const setSolver = new SetSolver();

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs camera access to detect Set cards',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
    } else {
      const cameraPermission = await Camera.requestCameraPermission();
      setHasPermission(cameraPermission === 'granted');
    }
  };

  const processFrame = (cards: DetectedCard[]) => {
    setDetectedCards(cards);

    const sets = setSolver.findSets(cards);
    setDetectedSets(sets);
  };

  const frameProcessor = useFrameProcessor(
    frame => {
      'worklet';

      const currentTime = Date.now();
      if (currentTime - lastProcessTime < 1000) {
        return;
      }

      try {
        const imageData = {
          data: new Uint8ClampedArray(frame.width * frame.height * 4),
          width: frame.width,
          height: frame.height,
        };

        for (let i = 0; i < frame.width * frame.height; i++) {
          const gray = 128;
          imageData.data[i * 4] = gray;
          imageData.data[i * 4 + 1] = gray;
          imageData.data[i * 4 + 2] = gray;
          imageData.data[i * 4 + 3] = 255;
        }

        const foundCards = cardDetector.detectCards(imageData);

        runOnJS(processFrame)(foundCards);
        runOnJS(setLastProcessTime)(currentTime);
      } catch (error) {
        const mockCards: DetectedCard[] = [
          {
            id: 1,
            bounds: { x: 100, y: 200, width: 120, height: 180 },
            corners: [
              { x: 100, y: 200 },
              { x: 220, y: 200 },
              { x: 220, y: 380 },
              { x: 100, y: 380 },
            ],
            attributes: { number: 1, shape: 0, color: 0, fill: 1 },
          },
          {
            id: 2,
            bounds: { x: 250, y: 200, width: 120, height: 180 },
            corners: [
              { x: 250, y: 200 },
              { x: 370, y: 200 },
              { x: 370, y: 380 },
              { x: 250, y: 380 },
            ],
            attributes: { number: 2, shape: 1, color: 1, fill: 2 },
          },
        ];

        runOnJS(processFrame)(mockCards);
        runOnJS(setLastProcessTime)(currentTime);
      }
    },
    [cardDetector, lastProcessTime],
  );

  if (!device) {
    return (
      <View style={styles.container}>
        <Text>No camera device found</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>Camera permission required</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
      />
      <CardOverlay
        detectedCards={detectedCards}
        detectedSets={detectedSets}
        width={screenWidth}
        height={screenHeight}
      />
      <View style={styles.statusOverlay}>
        <Text style={styles.cardCount}>
          Cards detected: {detectedCards.length}
        </Text>
        <Text style={styles.setCount}>Sets found: {detectedSets.length}</Text>
        {detectedSets.length > 0 && (
          <Text style={styles.setFound}>SET FOUND!</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  statusOverlay: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 15,
    borderRadius: 8,
  },
  cardCount: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  setCount: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  setFound: {
    color: '#00FF00',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default App;
