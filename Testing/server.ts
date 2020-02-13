
const path = require('path')
const { spawn } = require('child_process')
const readline = require('readline');
import express from 'express';
import fs from 'fs'
var http = require('http');
const app = express();
var server = http.createServer(app)
var io = require('socket.io').listen(server)
var ss = require('socket.io-stream');
var ytdl = require('ytdl-core')
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffmpeg = require('fluent-ffmpeg');
const YouTube = require('youtube-node');
const fetch = require('node-fetch');
var $ = require('jquery');
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
// console.log(ffmpegInstaller.path, ffmpegInstaller.version);
module.exports = ffmpeg;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var SocketIOFile = require('socket.io-file');
var SpotifyWebApi = require('spotify-web-api-node');
var Spotify = require('spotify-web-api-js');
var spotifyPlaylist = require('spotify-playlist');
var s = new Spotify();
const YT_API_KEY = 'AIzaSyCpyQhqmRjOxdYXIc1bWl7uM4LAN2eU3PU'
var downloadPath = path.join(__dirname);
let port = 3001
let DATA = 0;
let emitplaylists: any;
//let url = 'https://www.youtube.com/watch?v=FJt7gNi3Nr4'
let SPOTIFY_ACCESS_CODE = 0;
var SongsToDownload_Id: string[] = []
var SongsToDownload_FileName: any[] = []
var SongsToDownload_Index: any = []
var SongsToDownload_Socket: any = []
var LastYTCall = 0;
var YTCallDelay = 10;


var current_songs_downloading = 0;
const MAXSONGSDOWNLOADEDATONCE = 50;
//spotify shit
// var spotifyApi = new SpotifyWebApi({
//   clientId: '5a50ec388e014dda8c475275e7a39631',
//   clientSecret: '58ce595bfef64775aea3a7a32bd83116'
// });

// // Retrieve an access token
// spotifyApi.clientCredentialsGrant().then(
//   function(data: any) {
//     console.log('The access token expires in ' + data.body['expires_in']);
//     console.log('The access token is ' + data.body['access_token']);

//     // Save the access token so that it's used in future calls
//     SPOTIFY_ACCESS_CODE = (data.body['access_token'])
//     spotifyApi.setAccessToken(data.body['access_token']);
//     new_get_play_lists('wiktortheboss')
//   //   spotifyApi.getUserPlaylists('wiktortheboss')
//   // .then(function(data: any) {
//   //   console.log('Retrieved playlists', data.body.items);
//   // },function(err: any) {
//   //   console.log('Something went wrong!', err);
//   // });

//   });
// function new_get_play_lists(username: any){
// spotifyApi = new SpotifyWebApi();
// spotifyApi.setAccessToken(SPOTIFY_ACCESS_CODE);
// spotifyApi.getUserPlaylists(username)
//   .then(function(data: any) {
//     console.log('User playlists', data.body.items);
//     console.log('User playlists2', data.body.items[0].tracks.href);
// //     $.ajax({
// //       url: 'https://api.spotify.com/v1/me',
// //       headers: {
// //           'Authorization': 'Bearer ' + SPOTIFY_ACCESS_CODE
// //       },
// //       success: function(response:any) {
// //           fetch(data.body.items[0].tracks.href )
// //     .then((res:any) => res.json())
// //     .then((json:any) => console.log(json));
// //       }



// // })
// })
// }
app.use(express.static(path.join(__dirname, 'www')));

// app.get('/downloadFile/', (req, res) => {
//   var files = fs.createReadStream("idk.txt");
//   res.writeHead(200, {'Content-disposition': 'attachment; filename=idk.txt'}); //here you can add more headers
//   files.pipe(res)
// })


server.listen(port)
console.log('server started on port '/*+process.env.PORT ||*/ + port);
//server.listen(process.env.PORT);
var username = '';
io.sockets.on('connection', function (socket: any) {
  ss(socket).on('filedownload', function (stream: any, name: any, callback: any) {

    //== Do stuff to find your file
    callback(0, {
      name: "idk.txt",
      size: 500
    });

    var MyFileStream = fs.createReadStream(name);
    //     require('fs').createReadStream('idk.txt').on('data', function (chunk: any) {
    //     console.log("?"+chunk.toString());
    // });
    MyFileStream.pipe(stream);

  });

  ss(socket).on('profile-image', function (stream: any, data: any) {
    var filename = path.basename(data.name);
    stream.pipe(fs.createWriteStream(filename));
  });

  socket.on('request_playlists', function () {
    console.log("requested playlists")
    console.log("wgar" + username)
    callPython(socket, "playlists", 'script.py', username);
    //console.log(socket.temp)
    // socket.emit("playlists", temp)
  })

  socket.on('disconnect', function () {
    console.log("bye")
  })
  socket.on('username', function (data: any) {
    username = data
  })
  socket.on('request_playlist', function (playlist: any) {
    console.log("requested playlist")
    callPython(socket, 'playlist', 'get-playlist.py', username, playlist)
    //socket.emit("playlist", callPython('get-playlist.py',username,playlist))
  })
  socket.on('download_playlists', function (data: any) {

    console.log("called: " + data.length)
    console.log(data)
    let temp = data;
    // let temp = data.split('')
    // for (let i = 0; i < temp.length; i++) {
    //   if (temp[i] === "\"") {
    //     temp.splice(i, 1, "\'")
    //   }
    // }

    // let unicodegay = false;
    // if (temp[1] === 'u') {
    //   console.log("unicode")
    //   unicodegay = true;
    // }
    // if (unicodegay === true) {
    //   temp.splice(0, 3)
    //   if (temp[temp.length - 2].charCodeAt(0) === 13) {
    //     temp.splice(temp.length - 4, 3)
    //   }
    //   else {

    //     temp.splice(temp.length - 3, 2)
    //   }
    //   temp = temp.join('')
    //   temp = temp.split("', u'")
    // }
    // else {
    //   temp.splice(0, 2)
    //   if (temp[temp.length - 2].charCodeAt(0) === 13) {
    //     temp.splice(temp.length - 4, 3)
    //   }
    //   else {

    //     temp.splice(temp.length - 3, 2)
    //   }
    //   temp = temp.join('')
    //   temp = temp.split("', '")
    // }
    socket.song_index = 0;


    // Data which will write in a file. 
    // let info = temp

    // // Write data in 'Output.txt' . 
    // fs.writeFile('Output.txt', info, (err) => {

    //   // In case of a error throw err. 
    //   if (err) throw err;
    // })
    //console.log("size: "+temp.length)
    LastYTCall = Date.now()
    for (let i = 0; i < temp.length / 2; i++) {
      //console.log(temp[i*2+1]+" "+temp[i*2]+" audio")
      console.log(i + "   " + socket.song_index)
      callwithdelay(i, temp, socket.song_index)
      socket.song_index++;
    }
    // console.log("list:")
    // console.log(socket.TYIdlist)
    // for(let i =0; i< socket.TYIdlist.length; i++){
    //   downloadYTfile(socket.TYIdlist[i]);
    // }
    function callwithdelay(i: any, temp: any, index: any) {
      if (Date.now() - LastYTCall > YTCallDelay) {
        LastYTCall = Date.now()
        getYTIdfromName(temp[i * 2] + " " + temp[i * 2 + 1] + " audio", index)
      }
      else {
        setTimeout(function () {
          callwithdelay(i, temp, index)
        }, YTCallDelay)
      }
    }


    function getYTIdfromName(search: any, song_index: any) {

      let index = 0;
      let found = false

      var youTube = new YouTube();
      youTube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');

      ytsearch()
      function ytsearch() {
        console.log("called yt search")
        youTube.search(search, 2, function (error: any, result: any) {
          if (error) {
            console.log("really bad1")
            console.log(error);
            //ytsearch();
          }
          //exclude playlist cause they fuck shit up
          else {
            while (found === false && index < 10) {
              if (error) {
                console.log("really bad2")
                console.log(error);
                //ytsearch();
              }
              else {

                //console.log(JSON.stringify(result.items[index].id.videoId, null, 2));
                if (JSON.stringify(result.items[index], null, 2) !== undefined && JSON.stringify(result.items[index].id.videoId, null, 2) !== undefined) {
                  let temp1 = JSON.stringify(result.items[index].id.videoId, null, 2).replace(/['"]+/g, '')
                  //console.log(")))))))))))))))))))))))")
                  //console.log(temp1)
                  // search = search.split(" ")
                  // for(let i = 0; i< search.length; i++){
                  //   if(search[i]==='\n' || search[i]==='.' || search[i]==='*' || search[i]==='/' || search[i]==='\\'|| search[i]===':'|| search[i]==='?'|| search[i]==='>'|| search[i]==='<'|| search[i]==='|')
                  //   search.splice(i,1)
                  // }
                  // let i = search.length
                  // if(search[i]==='\n' || search[i]==='.' || search[i]==='*' || search[i]==='/' || search[i]==='\\'|| search[i]===':'|| search[i]==='?'|| search[i]==='>'|| search[i]==='<'|| search[i]==='|'){
                  //   console.log("nigfa")
                  //   search.splice(i,1)
                  // }
                  // console.log(search)
                  // search.join('')
                  var filename = search.replace(/[^a-z0-9]/gi, '_').toLowerCase();

                  if (current_songs_downloading <= MAXSONGSDOWNLOADEDATONCE) {
                    current_songs_downloading++
                    console.log(temp1)
                    downloadYTfile(temp1, filename, song_index)
                  }
                  else {
                    console.log("stored")
                    SongsToDownload_Id.push(temp1);
                    SongsToDownload_FileName.push(filename);
                    SongsToDownload_Index.push(song_index);
                    SongsToDownload_Socket.push(socket.id)
                  }
                  found = true
                }
                else {
                  console.log("bad" + index)
                  console.log(JSON.stringify(result.items))
                  index++;
                }
              }
            }
            if (index !== 0) {
              console.log(search + "  " + song_index)
            }
            if (index === 10) {
              console.log("bigboy " + search)
            }
          }
        });
        //downloadYTfile("FJt7gNi3Nr4")

      }
    }
    function downloadYTfile(id: any, key: any, index: any) {
      if (current_songs_downloading < 0) {
        console.log("current songs downloading: " + current_songs_downloading)
      }
      let stream = ytdl(id, {
        quality: 'highestaudio',
        //filter: 'audioonly',
      });
      stream.on('progress', function (chunkLength: any, downloaded: any, total: any) {
        socket.emit('download_info', downloaded / total, index)
      })
      temp = ss.createStream();

      ss(socket).emit('file', temp, key + ".mp3", index);
      //var outStream = fs.createWriteStream('test.txt');

      var command = ffmpeg(stream)
        .audioBitrate(128)
        .format('mp3')

        //.save(`${__dirname+"/Downloaded_stuff"}/${key}.mp3`)
        // .on('progress', (p: any)   => {
        //   readline.cursorTo(process.stdout, 0);
        //   process.stdout.write(`${p.targetSize}kb downloaded`);
        // })
        .on('error', function (err: any) {
          let info = err.message

          // Write data in 'Output.txt' . 
          fs.writeFile('Output.txt', info, (err) => {

            // In case of a error throw err. 
            if (err) throw err;
          })
          console.log('An error occurred: ' + err.message);
          console.log("key: " + key)
          console.log(current_songs_downloading)
          current_songs_downloading--;
          console.log("size: " + SongsToDownload_FileName.length)
          if (SongsToDownload_FileName.length !== 0) {
            console.log("herr")
            if (err.message === "Output stream error: Connection aborted") {
              console.log("user dc")
              for (let i = 0; i < SongsToDownload_Socket.length; i++) {
                if (socket.id === SongsToDownload_Socket[i]) {
                  console.log("removing: " + SongsToDownload_FileName[i])
                  SongsToDownload_FileName.splice(i, 1)
                  SongsToDownload_Id.splice(i, 1)
                  SongsToDownload_Index.splice(i, 1)
                  SongsToDownload_Socket.splice(i, 1)
                }
              }
            }
            // downloadYTfile(SongsToDownload_Id[0], SongsToDownload_FileName[0], SongsToDownload_Index[0])
            // SongsToDownload_FileName.splice(0, 1)
            // SongsToDownload_Id.splice(0, 1)
            // SongsToDownload_Index.splice(0, 1)
            // SongsToDownload_Socket.splice(0, 1)
            // current_songs_downloading++;
            // console.log("new: " + current_songs_downloading)
          }

        })
        .on('end', () => {
          //console.log(`\ndone, thanks - ${(Date.now() - start) / 1000}s`);
          current_songs_downloading--;
          if (SongsToDownload_FileName.length !== 0) {
            downloadYTfile(SongsToDownload_Id[0], SongsToDownload_FileName[0], SongsToDownload_Index[0])
            SongsToDownload_FileName.splice(0, 1)
            SongsToDownload_Id.splice(0, 1)
            SongsToDownload_Index.splice(0, 1)
            SongsToDownload_Socket.splice(0, 1)
            current_songs_downloading++;
          }


          //socket.emit('song_ready_to_download', key)

          //send to client
          //after delete bc we r poor and dont afford memory
          //TODO VERY IMPORTSNT TO DELETE AFTER CAUSE IM NOT DOWNLOADING 50,000 sonfs on my pc
          // let filePath =path.join(__dirname +"/"+key+".mp3");
          // fs.unlinkSync(filePath);
        }).writeToStream(temp);
      //var ffstream = command.pipe();
      //  ffstream.on('data', function(chunk:any) {
      //    console.log('ffmpeg just wrote ' + chunk.length + ' bytes');
      //  });

    }
  })




});


/**
 * Run python script, pass in `-u` to not buffer console output 
 * @return {ChildProcess}
 */
function runScript(file: any, param1?: any, param2?: any, param3?: any) {
  return spawn('python', [
    "-u",
    path.join(__dirname, file),
    param1,
    param2,
    param3,
  ]);
}
function callPython(socket: any, calltoclient: any, file: any, param1?: any, param2?: any, param3?: any) {
  let temp = '';
  const subprocess = runScript(file, param1, param2, param3)
  // print output of script
  subprocess.stdout.on('data', (data: any) => {

    temp = temp + (data.toString())

  });
  subprocess.stderr.on('data', (data: any) => {
    console.log(`error:${data}`);
  });
  subprocess.on('close', () => {
    console.log(temp);
    returndata(socket, calltoclient, temp)
  });

  if (returndata !== null) {
    return returndata
  }
}
function returndata(socket: any, calltoclient: any, data: any) {

  socket.data = data
  socket.emit(calltoclient, data)
}

// let stream = ytdl('7JGDWKJfgxQ', {
//   quality: 'highestaudio',
//   //filter: 'audioonly',
// });
// stream.on('progress', function (chunkLength: any, downloaded: any, total: any) {
//   console.log( downloaded / total)
// })
// stream.on('error', console.error)