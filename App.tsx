import React, { useEffect } from 'react';
import RNFetchBlob from 'rn-fetch-blob'
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import RNFS from 'react-native-fs';
import ReactNativeBlobUtil from 'react-native-blob-util';
import TrackPlayer, { Event, State } from 'react-native-track-player';
import base64 from 'react-native-base64';

const App = () => {

  const url = 'https://api.us-south.text-to-speech.watson.cloud.ibm.com/v1/synthesize'
  const voice = 'pt-BR_IsabelaV3Voice';
  const text = `por favor, não siga viagem! A luz acesa indica que a pressão do óleo do motor está muito baixa. Desligue o carro, deixe o motor esfriar e verifique o nível do óleo. Se estiver abaixo da marca mínima, <sub alias='compléte'>complete</sub> o reservatório. Caso a luz de advertência permaneça acesa, mantenha o carro desligado, para não causar nenhum <sub alias='dãno'>dano</sub> ao motor <break time='100ms'></break>e solicite ajuda para uma Concessionária <phoneme alphabet='ibm' ph='vouksvagen'>Volkswagen</phoneme> ou empresa especializada.`

  TrackPlayer.setupPlayer()

  const makeid = (length: number) => {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const fetchSpeech = async (text: string[]) => {

    console.log('Fetching speech', text.length)

    text.forEach(async (stringPart: string, index: number) => {

      const base_url = `${url}?accept=audio%2Fmp3&text=${encodeURI(
        stringPart,
      )}&voice=${voice}`;
      const encodedKey = base64.encode(`apikey:AykOy7c7Wweq2gxMA0_j3N6ZJCjZXxGJ9KcWbVaPD6DC`);
      const path = `${RNFS.DocumentDirectoryPath}/audio_${index}.mp3`;

      try {
        await ReactNativeBlobUtil.config({ fileCache: true, path: path })
          .fetch('GET', base_url, {
            Authorization: `Basic ${encodedKey}`,
          });
        TrackPlayer.add({
          id: 'trackId',
          url: 'file://' + path,
          title: 'Track Title',
          artist: 'Track Artist',
          position: index
        });
        console.log('path: ', 'file://' + path);
      } catch {
        return 'error';
      }
    })

  };

  const splitString = (inputString: string) => {
    const splitStrings = inputString.split(/[.!]+/).map(str => str.trim()).filter(str => str.length > 0);
    console.log('splitStrings', splitStrings)
    fetchSpeech(splitStrings)
  };

  const start = async () => {
    // await TrackPlayer.add([{
    //   id: 'trackId',
    //   url: require('./sound/result1.mp3'),
    //   title: 'Track Title',
    //   artist: 'Track Artist'
    // },
    // {
    //   id: 'trackId',
    //   url: require('./sound/result2.mp3'),
    //   title: 'Track Title',
    //   artist: 'Track Artist'
    // },
    // {
    //   id: 'trackId',
    //   url: require('./sound/result3.mp3'),
    //   title: 'Track Title',
    //   artist: 'Track Artist'
    // }]);

    // Start playing it
    TrackPlayer.play()
  };

  return (
    <View>
      <Button title='play' onPress={async () => {
        // const state = await TrackPlayer.getState()
        // if (state === State.Playing) TrackPlayer.reset()
        // else TrackPlayer.reset().then(() => start())
        start()
      }
      } />
      <Button title='state' onPress={async () => console.log(await TrackPlayer.getState())} />
      <Button title='string' onPress={async () => splitString(text)} />
      <Button title='queue' onPress={async () => console.log(await TrackPlayer.getQueue())} />
    </View>
  )
}

export default App;

