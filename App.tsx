/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
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
import Sound from 'react-native-sound'
import TrackPlayer from 'react-native-track-player';
var Buffer = require("@craftzdog/react-native-buffer").Buffer;
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import arrayBufferToAudioBuffer from 'arraybuffer-to-audiobuffer';

const access_token = 'eyJraWQiOiIyMDIzMDMxMjA4MzAiLCJhbGciOiJSUzI1NiJ9.eyJpYW1faWQiOiJpYW0tU2VydmljZUlkLTNiOTVjODk4LTI0NDQtNDFiYi04NjVlLTU1YzE2MjlmZDgyNyIsImlkIjoiaWFtLVNlcnZpY2VJZC0zYjk1Yzg5OC0yNDQ0LTQxYmItODY1ZS01NWMxNjI5ZmQ4MjciLCJyZWFsbWlkIjoiaWFtIiwianRpIjoiNjNiY2IwNTUtNGMwOS00NmY0LTljZWMtZTBkNGMwOWVkNzgxIiwiaWRlbnRpZmllciI6IlNlcnZpY2VJZC0zYjk1Yzg5OC0yNDQ0LTQxYmItODY1ZS01NWMxNjI5ZmQ4MjciLCJuYW1lIjoiQXV0by1nZW5lcmF0ZWQgc2VydmljZSBjcmVkZW50aWFscyIsInN1YiI6IlNlcnZpY2VJZC0zYjk1Yzg5OC0yNDQ0LTQxYmItODY1ZS01NWMxNjI5ZmQ4MjciLCJzdWJfdHlwZSI6IlNlcnZpY2VJZCIsInVuaXF1ZV9pbnN0YW5jZV9jcm5zIjpbImNybjp2MTpibHVlbWl4OnB1YmxpYzp0ZXh0LXRvLXNwZWVjaDp1cy1zb3V0aDphLzZkN2M1MmNmYWEyYzA2NDQxNDJlMjEzYTY3MDU1Yzc4OjgyNTRlNDNlLTUwYTUtNDdjMS1hNTdjLWJiMGEyMmZmZGFhNDo6Il0sImF1dGhuIjp7InN1YiI6IlNlcnZpY2VJZC0zYjk1Yzg5OC0yNDQ0LTQxYmItODY1ZS01NWMxNjI5ZmQ4MjciLCJpYW1faWQiOiJpYW0tU2VydmljZUlkLTNiOTVjODk4LTI0NDQtNDFiYi04NjVlLTU1YzE2MjlmZDgyNyIsInN1Yl90eXBlIjoiU2VydmljZUlkIiwibmFtZSI6IkF1dG8tZ2VuZXJhdGVkIHNlcnZpY2UgY3JlZGVudGlhbHMifSwiYWNjb3VudCI6eyJ2YWxpZCI6dHJ1ZSwiYnNzIjoiNmQ3YzUyY2ZhYTJjMDY0NDE0MmUyMTNhNjcwNTVjNzgiLCJmcm96ZW4iOnRydWV9LCJpYXQiOjE2Nzk5NDc5MTIsImV4cCI6MTY3OTk1MTUxMiwiaXNzIjoiaHR0cHM6Ly9pYW0uY2xvdWQuaWJtLmNvbS9pZGVudGl0eSIsImdyYW50X3R5cGUiOiJ1cm46aWJtOnBhcmFtczpvYXV0aDpncmFudC10eXBlOmFwaWtleSIsInNjb3BlIjoiaWJtIG9wZW5pZCIsImNsaWVudF9pZCI6ImRlZmF1bHQiLCJhY3IiOjEsImFtciI6WyJwd2QiXX0.tZ_ALFs__RSswdsv-fWsKDCNjidpdpM-X_lu1-yLDa4OaCLTfaYym33JB5u5cGPK9X1SvX2LTmlXWD4KGBjR5qUZH3R3ZIF2QB9D0dKXXFfEtLQiKPg3iK7gzf0IVvsQjaCB83Y11N3_xj39Gy6BfCtZiRckPqp0XuuIT3MN969EaegF-O1gqA8Xteq2Qg6fqP0WOzt7WyFOyp3ytulXQ147a24YhGxerHxxpMhUrrsnzHnErCTXI3abuZlOGhFjNdvdx7-bEVry642I4hZbs8qjfQQDK5QmmJzW5YVDDRvYVeFs4WdY9IZWUsmWZs68STSpOvSy0wSEP4AeEMS3ig';

const wsURI = 'wss://api.us-south.text-to-speech.watson.cloud.ibm.com/instances/8254e43e-50a5-47c1-a57c-bb0a22ffdaa4/v1/synthesize'
  + '?access_token=' + access_token
  + '&voice=pt-BR_IsabelaV3Voice';

const App = () => {

  // useEffect(() => {
  //   TrackPlayer.setupPlayer()
  // }, [])

  var messages: any;
  var audioStream: any;

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
  // Sound.setCategory('Playback');

  function onOpen() {
    var message = {
      text: `por favor, não siga viagem! A luz acesa indica que a pressão do óleo do motor está muito baixa. Desligue o carro, deixe o motor esfriar e verifique o nível do óleo. `
      // accept: 'audio/mp3'
    };
    // The service currently accepts a single message per WebSocket connection.
    websocket.send(JSON.stringify(message));
  }

  let audioParts: any[] = [];
  let finalAudio: Blob;
  const base64 = RNFetchBlob.base64

  async function onMessage(evt: any) {

    if (typeof evt.data === 'string') {
      // console.log('Received string message: ', evt.data)
      
      // messages += evt.data;
    } else {
      // console.log('Received ' + evt.data + ' binary bytes');
      
      
      console.log('closed', JSON.stringify(evt));
      // arrayBufferToAudioBuffer(evt)
      //   .then((audioBuffer: any) => {
      //     // do something with AudioBuffer
      //     console.log("audio", audioBuffer);
      //   })
      audioStream += evt.data;

    }
    
  }

  async function onClose(evt: any) {
    console.log('WebSocket closed', evt.code, evt.reason);
    console.log('closed', audioStream);
    // var buffer = Buffer.from(audioParts);
    // finalAudio = new Blob([buffer], { lastModified: Date.now(), type: 'audio/mp3' });
    // console.log('final audio: ', finalAudio);
  }

  function onError(evt: any) {
    console.log('WebSocket error', evt);
  }

  var websocket = new WebSocket(wsURI);
  websocket.onopen = onOpen;
  websocket.onclose = onClose;
  websocket.onmessage = onMessage;
  websocket.onerror = onError;


  // const play = (audio: any) => {
  //   var ding = new Sound(audio, Sound.MAIN_BUNDLE, (error) => {
  //     if (error) {
  //       console.log('failed to load the sound', error);
  //       return;
  //     }
  //     // when loaded successfully
  //     console.log('duration in seconds: ' + ding.getDuration() + 'number of channels: ' + ding.getNumberOfChannels());
  //   });

  // }




  return (
    // console.log('audioParts', audioParts),
    <View>
      <Text>Teste</Text>
      <Button title='play' onPress={() => { }} />
    </View>
  )
}

export default App;
