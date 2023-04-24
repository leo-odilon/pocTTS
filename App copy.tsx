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
import Sound from 'react-native-sound'
// var Buffer = require("@craftzdog/react-native-buffer").Buffer;
import RNFS from 'react-native-fs';
import arrayBufferToAudioBuffer from 'arraybuffer-to-audiobuffer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Buffer } from '@craftzdog/react-native-buffer';
import ReactNativeBlobUtil from 'react-native-blob-util';
import TrackPlayer, { Event, State } from 'react-native-track-player';

const access_token = 'eyJraWQiOiIyMDIzMDQxMTA4MzEiLCJhbGciOiJSUzI1NiJ9.eyJpYW1faWQiOiJpYW0tU2VydmljZUlkLTNiOTVjODk4LTI0NDQtNDFiYi04NjVlLTU1YzE2MjlmZDgyNyIsImlkIjoiaWFtLVNlcnZpY2VJZC0zYjk1Yzg5OC0yNDQ0LTQxYmItODY1ZS01NWMxNjI5ZmQ4MjciLCJyZWFsbWlkIjoiaWFtIiwianRpIjoiOWYwYjZkNmEtY2Y0Zi00M2I1LTgyMTQtYTc1OTQzNDQwYzFiIiwiaWRlbnRpZmllciI6IlNlcnZpY2VJZC0zYjk1Yzg5OC0yNDQ0LTQxYmItODY1ZS01NWMxNjI5ZmQ4MjciLCJuYW1lIjoiQXV0by1nZW5lcmF0ZWQgc2VydmljZSBjcmVkZW50aWFscyIsInN1YiI6IlNlcnZpY2VJZC0zYjk1Yzg5OC0yNDQ0LTQxYmItODY1ZS01NWMxNjI5ZmQ4MjciLCJzdWJfdHlwZSI6IlNlcnZpY2VJZCIsInVuaXF1ZV9pbnN0YW5jZV9jcm5zIjpbImNybjp2MTpibHVlbWl4OnB1YmxpYzp0ZXh0LXRvLXNwZWVjaDp1cy1zb3V0aDphLzZkN2M1MmNmYWEyYzA2NDQxNDJlMjEzYTY3MDU1Yzc4OjgyNTRlNDNlLTUwYTUtNDdjMS1hNTdjLWJiMGEyMmZmZGFhNDo6Il0sImF1dGhuIjp7InN1YiI6IlNlcnZpY2VJZC0zYjk1Yzg5OC0yNDQ0LTQxYmItODY1ZS01NWMxNjI5ZmQ4MjciLCJpYW1faWQiOiJpYW0tU2VydmljZUlkLTNiOTVjODk4LTI0NDQtNDFiYi04NjVlLTU1YzE2MjlmZDgyNyIsInN1Yl90eXBlIjoiU2VydmljZUlkIiwibmFtZSI6IkF1dG8tZ2VuZXJhdGVkIHNlcnZpY2UgY3JlZGVudGlhbHMifSwiYWNjb3VudCI6eyJ2YWxpZCI6dHJ1ZSwiYnNzIjoiNmQ3YzUyY2ZhYTJjMDY0NDE0MmUyMTNhNjcwNTVjNzgiLCJmcm96ZW4iOnRydWV9LCJpYXQiOjE2ODEzMDM3ODEsImV4cCI6MTY4MTMwNzM4MSwiaXNzIjoiaHR0cHM6Ly9pYW0uY2xvdWQuaWJtLmNvbS9pZGVudGl0eSIsImdyYW50X3R5cGUiOiJ1cm46aWJtOnBhcmFtczpvYXV0aDpncmFudC10eXBlOmFwaWtleSIsInNjb3BlIjoiaWJtIG9wZW5pZCIsImNsaWVudF9pZCI6ImRlZmF1bHQiLCJhY3IiOjEsImFtciI6WyJwd2QiXX0.iIgnB2ydKqwGocp1bNsh-QYl7IHDgde97jiF-5kMvMU-UrFIv9G1DBc3iTAo6IxSY438k1mYiyBwPWT4q7YuViOc4UI16qUpDTvByT_8DaejJrfT_9Bv6SiAAzWoUchy11i-AmeGbtM_wOQR0yxpXRQpodiroN8wJTqCVWC439XwFOr135T5nLvLs0kEKgtMI5SFOIlZ9uC7a2j6c6yDMAuuSzfB4dKSgOjiiEhg66UA10i-MoCQRlZWUKI0NNW2W6O4SKYU_cJs8ZqnVZMFm_O_XFJszqC_sTVaO2kYfIu83OxJZGBJSp014C-SQig6ySFBCmXb330rlUafvfJbQg';

const wsURI = 'wss://api.us-south.text-to-speech.watson.cloud.ibm.com/instances/8254e43e-50a5-47c1-a57c-bb0a22ffdaa4/v1/synthesize?voice=pt-BR_IsabelaV3Voice';
// + '?access_token=' + access_token
// + '&voice=pt-BR_IsabelaV3Voice';

const headers = {
  Authorization: "Bearer " + access_token
};

const App = () => {

  var messages: string;
  var audioParts: any = [];
  var audioStream: any = [];
  var buffer: any = [];
  let blob: any
  const fs = RNFetchBlob.fs
  const base64 = RNFetchBlob.base64

  TrackPlayer.setupPlayer()


  function onOpen() {
    var message = {
      text: `por favor, não siga viagem! A luz acesa indica que a pressão do óleo do motor está muito baixa. Desligue o carro, deixe o motor esfriar e verifique o nível do óleo. Se estiver abaixo da marca mínima, <sub alias='compléte'>complete</sub> o reservatório. Caso a luz de advertência permaneça acesa, mantenha o carro desligado, para não causar nenhum <sub alias='dãno'>dano</sub> ao motor <break time='100ms'></break>e solicite ajuda para uma Concessionária <phoneme alphabet='ibm' ph='vouksvagen'>Volkswagen</phoneme> ou empresa especializada.`,
      accept: "audio/mp3"
    };
    websocket.send(JSON.stringify(message));
  }


  async function onMessage(evt: WebSocketMessageEvent) {
    if (typeof evt.data === "string") {
      messages += evt.data;
      console.log(evt.data)
    } else {
      // console.log('Received ' + evt.data.size + ' binary bytes', evt.data.type);
      // buffer.push(Buffer.from(evt.data))
      // const decoded = new TextDecoder('utf-8').decode(buffer);
      // console.log(buffer)


      // blob = new Blob([buffer], { lastModified: Date.now(), type: 'audio/mp3' });
      // convertBlobToBase64(blob)
      // var decoder = new TextDecoder('utf8');
      // var b64encoded = btoa(decoder.decode(u8));
      // console.log(buffer)
      // audioParts.push(evt.data);
      // console.log("--------------------------------");
    }
  }

  var finalAudio: any = [];
  async function onClose(evt: any) {
    blob = new Blob([buffer], { lastModified: Date.now(), type: 'audio/mpeg' })
    // convertBlobToBase64(blob)
    // console.log(blob)
    console.log(blob)
    // FFmpegKit.execute(blob).then(async (session) => {
    //   const returnCode = await session.getReturnCode();


    //   }).catch((err: any) => {console.log(err)})
    // fs.createFile(path, base64.encode(blob), 'base64')
    // RNFS.writeFile(path, blob, { encoding: 'base64' })

    // const fd = await BinaryFile.open(blob);
    // console.log('WebSocket closed', evt.code, evt.reason);
    // console.log('closed', audioStream);
    // var buffer = Buffer.from(audioStream);
    // var buffer =Buffer.from(evt.data, 'utf-8').toString('base64')
    // console.log(buffer)
    // finalAudio = new Blob([audioStream], { lastModified: Date.now(), type: 'audio/mp3' });
    // console.log('final audio: ', finalAudio);
    // AsyncStorage.setItem('finalAudio', JSON.stringify(finalAudio));
    // play();
  }



  function onError(evt: any) {
    console.log('WebSocket error', evt);
  }

  var websocket = new WebSocket(wsURI, null, {
    headers
  });

  // websocket.onopen = onOpen;
  // websocket.onclose = onClose;
  // websocket.onmessage = onMessage;
  // websocket.onerror = onError;

  const play = () => {
    // AsyncStorage.getItem("finalAudio")
    //   .then(res => {
    //     console.log(res)
    //     if (res !== null) {
    //       console.log(res)
    //     }
    //   })
    //   .catch(err => console.log(1));
    // ding.play(), ding1.play();

  }

  const start = async () => {
    // Set up the player

    // await TrackPlayer.setupPlayer();

    // Add a track to the queue
    await TrackPlayer.add([{
      id: 'trackId',
      url: require('./sound/result1.mp3'),
      title: 'Track Title',
      artist: 'Track Artist'
    },
    {
      id: 'trackId',
      url: require('./sound/result2.mp3'),
      title: 'Track Title',
      artist: 'Track Artist'
    },
    {
      id: 'trackId',
      url: require('./sound/result3.mp3'),
      title: 'Track Title',
      artist: 'Track Artist'
    }]);

    // Start playing it
    TrackPlayer.play()
  };

  return (
    TrackPlayer.getState().then((state) => { console.log('state', state) }),
    <View>
      <Text>Teste</Text>
      <Button title='play' onPress={async ()=> {
        const state = await TrackPlayer.getState()
        if (state === State.Playing ) TrackPlayer.reset()
        else TrackPlayer.reset().then(() => start())
      }
      } />
      <Button title='state' onPress={async () => console.log(await TrackPlayer.getState())} />
    </View>
  )
}

export default App;

