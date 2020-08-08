
let server;
var game;
var songcount = 0;
let fileBuffers;
let fileLengths;
let doneSongs;
let songNames;
let songDownloadNames;
let indexarray = []
let download_info_array;
let request_playlists = false;
let request_playlist_songs = false;
let download_ready = true;
let select_download_songs_array = [];
let songs_to_download = [];
let selection_table_over = false;



document.getElementById("button1").style.visibility = "hidden";

window.onload = function () {
    game = new Game();
    game.init();
};
var Game = function () {
    this.socket = null;
};


Game.prototype = {
    server: 0,
    init: function () {
        var that = this;
        this.socket = io.connect();
        this.socket.on('connect', function () {

            console.log("nice")
            onload()
            //             var temp = document.createElement("input");
            //             temp.setAttribute('type','button');
            //             document.body.appendChild(temp);
            //             temp.addEventListener('click', function () {
            //             console.log("called")
            //             downloadFile("AC3.jpg", "AC3.jpg")
            //             //window.open("http://localhost:3001/downloadFile")
            // })
        });
        this.socket.on('error', function (err) {

            console.log("bad")
        });
        this.socket.on('song_ready_to_download', function (name) {
            console.log("downloading: " + name)
            downloadFile("Downloaded_stuff/" + name + ".mp3", name + ".mp3")
        })
        let start = 0
        ss(this.socket).on('file', function (stream, originalFilename, index) {
            for (let i = 0; i < indexarray.length; i++) {
                if (indexarray[i] === index) {
                    console.log("same index: " + indexarray[i])
                }
            }
            indexarray.push(index)
            if (index >= songcount) {
                console.log("index: " + index)
                console.log(originalFilename)
            }
            songDownloadNames[index] = originalFilename;
            if (start === 0) {
                start = Date.now();
            }
            console.log('received');

            var deferred = $.Deferred();

            //== Create stream for file to be streamed to and buffer to save chunks
            stream.on('data', function (chunk) {
                //console.log("HERR>")
                fileLengths[index] += chunk.length;
                // var progress = Math.floor((fileLength / fileInfo.size) * 100);
                // progress = Math.max(progress - 2, 1);
                //deferred.notify(progress);
                fileBuffers[index].push(chunk);
            });

            stream.on('end', function () {
                doneSongs[index] = true;
                let finished = true;
                for (let i = 0; i < doneSongs.length; i++) {
                    if (doneSongs[i] === false) {
                        finished = false;
                    }
                }
                if (finished === true) {
                    console.log(`\ndone, thanks - ${(Date.now() - start) / 1000}s`);
                }
                var filedata = new Uint8Array(fileLengths[index]),
                    i = 0;

                //== Loop to fill the final array
                fileBuffers[index].forEach(function (buff) {
                    for (var j = 0; j < buff.length; j++) {
                        filedata[i] = buff[j];
                        i++;
                    }
                });

                deferred.notify(100);

                //== Download file in browser
                downloadFileFromBlob([filedata], originalFilename);

                deferred.resolve();
            });
        });
        function onload() {
            var x = document.createElement("INPUT");
            x.setAttribute("type", "text");
            x.setAttribute("value", "wiktortheboss");
            document.body.appendChild(x);
            x.addEventListener('keydown', function (e) {
                let z = document.getElementById("getplaylistsbtn");
                console.log(z)
                if (z === undefined || z === null) {
                    that.socket.on('download_info', function (percent, index) {
                        download_info_array[index] = percent;
                        addTable();
                    })
                    var messageInput = x,
                        msg = messageInput.value,
                        color = 'blue';
                    if (e.keyCode === 13 && msg.trim().length !== 0) {
                        messageInput.value = '';
                        var username = msg
                        that.socket.emit('username', username)
                        var getplaylistsbtn = document.createElement("input");
                        getplaylistsbtn.setAttribute('type', 'button');
                        getplaylistsbtn.setAttribute('name', 'Get Playlist');
                        getplaylistsbtn.setAttribute('value', 'Get Playlist');
                        getplaylistsbtn.setAttribute('id', 'getplaylistsbtn')
                        document.body.appendChild(getplaylistsbtn);
                        getplaylistsbtn.addEventListener('click', function () {

                            if (request_playlists === false) {
                                request_playlists = true;
                                that.socket.emit("request_playlists");
                                that.socket.on("playlists", function (data) {
                                    document.getElementById("button1").style.visibility = "visible";
                                    document.getElementById("button1").value = "confirm Playlist"
                                    var div = document.querySelector("#container"),
                                        frag = document.createDocumentFragment(),
                                        select = document.createElement("select");


                                    let temp2 = data.split('')
                                    for (let i = 0; i < temp2.length; i++) {
                                        if (temp2[i] === "\"") {
                                            temp2.splice(i, 1, "\'")

                                        }
                                    }
                                    console.log(temp2)


                                    for (let i = 0; i < temp2.length; i++) {
                                        if (temp2[i] === "\"") {
                                            console.log("bruh")
                                        }
                                    }
                                    let unicodegay = false;
                                    let temp = temp2
                                    if (temp[1] === 'u') {
                                        console.log("unicode")
                                        unicodegay = true;
                                    }
                                    if (unicodegay === true) {
                                        temp.splice(0, 3)
                                        if (temp[temp.length - 2].charCodeAt(0) === 13) {
                                            temp.splice(temp.length - 4, 3)
                                        }
                                        else {

                                            temp.splice(temp.length - 3, 2)
                                        }
                                        temp = temp.join('')
                                        temp = temp.split("', u'")
                                    }
                                    else {
                                        temp.splice(0, 2)
                                        if (temp[temp.length - 2].charCodeAt(0) === 13) {
                                            temp.splice(temp.length - 4, 3)
                                        }
                                        else {

                                            temp.splice(temp.length - 3, 2)
                                        }

                                        temp = temp.join('')
                                        temp = temp.split("', '")
                                    }
                                    temp2 = temp
                                    console.log(temp2)
                                    for (let i = 0; i < temp2.length; i++) {
                                        select.options.add(new Option(temp2[i]));
                                    }

                                    frag.appendChild(select);
                                    div.appendChild(frag);

                                    document.getElementById("button1").addEventListener('click', function () {

                                        if (false === request_playlist_songs) {
                                            request_playlist_songs = true;
                                            that.socket.emit('request_playlist', select.value)
                                            that.socket.on('playlist', function (data) {
                                                let temp2 = data.split('')
                                                for (let i = 0; i < temp2.length; i++) {
                                                    if (temp2[i] === "\"") {
                                                        temp2.splice(i, 1, "\'")

                                                    }
                                                }
                                                console.log(temp2.join(""))
                                                var temp = temp2
                                                let unicodegay = false;
                                                if (temp[1] === 'u') {
                                                    console.log("unicode")
                                                    unicodegay = true;
                                                }
                                                if (unicodegay === true) {
                                                    temp.splice(0, 3)
                                                    if (temp[temp.length - 2].charCodeAt(0) === 13) {
                                                        console.log("idfk")
                                                        temp.splice(temp.length - 4, 3)
                                                    }
                                                    else {
                                                        let n = (temp[temp.length - 2].charCodeAt(0))
                                                        console.log(n)
                                                        temp.splice(temp.length - 3, 2)
                                                    }
                                                    temp = temp.join('')
                                                    temp = temp.split("', u'")
                                                }
                                                else {
                                                    temp.splice(0, 2)
                                                    if (temp[temp.length - 2].charCodeAt(0) === 13) {
                                                        console.log("idfk")
                                                        temp.splice(temp.length - 4, 3)
                                                    }
                                                    else {
                                                        let n = (temp[temp.length - 2].charCodeAt(0))
                                                        console.log(n)
                                                        temp.splice(temp.length - 3, 2)
                                                    }
                                                    temp = temp.join('')
                                                    temp = temp.split("', '")
                                                }

                                                for (let i = 0; i < temp.length / 2; i++) {
                                                    select_download_songs_array[i] = true;
                                                }
                                                let song_to_be_selected = temp;
                                                console.log("arr: " + select_download_songs_array.length)
                                                songs_to_download_table(temp)

                                                let playlists = temp2;
                                                songNames = temp;
                                                console.log("songs: " + temp.length / 2)
                                                songcount = temp.length / 2
                                                temp = document.createElement("input");
                                                temp.setAttribute('value', 'select all')
                                                temp.setAttribute('type', 'button');
                                                temp.setAttribute('id', 'select_all_btn')
                                                document.body.appendChild(temp);
                                                temp.addEventListener('click', function () {
                                                    if (selection_table_over === false) {
                                                        
                                                        let all_true = true;
                                                        for (let i = 0; i < select_download_songs_array.length; i++) {
                                                            if (select_download_songs_array[i] === false) {
                                                                all_true = false;
                                                            }
                                                            select_download_songs_array[i] = true;
                                                        }
                                                        if (all_true) {
                                                            for (let i = 0; i < select_download_songs_array.length; i++) {
                                                                select_download_songs_array[i] = false;
                                                            }
                                                        }
                                                        songs_to_download_table(song_to_be_selected)
                                                    }
                                                })


                                                temp = document.createElement("input");
                                                temp.setAttribute('value', 'download')
                                                temp.setAttribute('type', 'button');
                                                temp.setAttribute('id', 'download_btn')
                                                document.body.appendChild(temp);
                                                temp.addEventListener('click', function () {
                                                    selection_table_over = true;
                                                    if (download_ready) {
                                                        fileBuffers = []
                                                        for (var j = 0; j < songcount; j++) {
                                                            fileBuffers.push([])
                                                        }
                                                        fileLengths = []
                                                        for (var j = 0; j < songcount; j++) {
                                                            fileLengths.push(0)
                                                        }
                                                        doneSongs = []
                                                        for (var j = 0; j < songcount; j++) {
                                                            doneSongs.push(false)
                                                        }
                                                        songDownloadNames = []
                                                        for (var j = 0; j < songcount; j++) {
                                                            songDownloadNames.push('')
                                                        }
                                                        download_info_array = []
                                                        for (var j = 0; j < songcount; j++) {
                                                            download_info_array.push(0)
                                                        }

                                                        for (let i = 0; i < select_download_songs_array.length; i++) {
                                                            if (select_download_songs_array[i]) {
                                                                songs_to_download.push(songNames[i * 2])
                                                                songs_to_download.push(songNames[i * 2 + 1])

                                                            }
                                                        }

                                                        console.log("called: " + songs_to_download.toString())
                                                        console.log(songs_to_download.toString())
                                                        console.log(songs_to_download[0])
                                                        console.log(songs_to_download[1])

                                                        console.log(data)
                                                        addTable();
                                                        data = songs_to_download;
                                                        console.log(data.length)
                                                        that.socket.emit('download_playlists', data)
                                                        clearBox("songs_to_download_table")
                                                        //downloadFile("AC3.jpg", "AC3.jpg") whazt it should do last
                                                        download_ready = false;
                                                    }
                                                })
                                            })
                                        }
                                    })
                                })
                            }
                        });
                    }
                    ;
                }
            }, false);

        }

        /** Download a file from the object store
 * @param {string} name Name of the file to download
 * @param {string} originalFilename Overrules the file's originalFilename
 * @returns {$.Deferred}
 */
        function downloadFile(name, originalFilename) {

            var deferred = $.Deferred();

            //== Create stream for file to be streamed to and buffer to save chunks
            var stream = ss.createStream(),
                fileBuffer = [],
                fileLength = 0;
            stream.on('data', function (chunk) {
                console.log("HERR>")
                fileLength += chunk.length;
                var progress = Math.floor((fileLength / fileInfo.size) * 100);
                progress = Math.max(progress - 2, 1);
                deferred.notify(progress);
                fileBuffer.push(chunk);
            });

            stream.on('end', function () {

                var filedata = new Uint8Array(fileLength),
                    i = 0;

                //== Loop to fill the final array
                fileBuffer.forEach(function (buff) {
                    for (var j = 0; j < buff.length; j++) {
                        filedata[i] = buff[j];
                        i++;
                    }
                });

                deferred.notify(100);

                //== Download file in browser
                downloadFileFromBlob([filedata], originalFilename);

                deferred.resolve();
            });

            //== Emit/Request
            ss(that.socket).emit('filedownload', stream, name, function (fileError, fileInfo) {
                if (fileError) {
                    console.log(fileError)
                    console.log(fileInfo)

                    deferred.reject(fileError);

                } else {

                    console.log(['File Found!', fileInfo]);

                    //== Receive data
                    stream.on('data', function (chunk) {
                        console.log("HERR>")
                        fileLength += chunk.length;
                        var progress = Math.floor((fileLength / fileInfo.size) * 100);
                        progress = Math.max(progress - 2, 1);
                        deferred.notify(progress);
                        fileBuffer.push(chunk);
                    });

                    stream.on('end', function () {

                        var filedata = new Uint8Array(fileLength),
                            i = 0;

                        //== Loop to fill the final array
                        fileBuffer.forEach(function (buff) {
                            for (var j = 0; j < buff.length; j++) {
                                filedata[i] = buff[j];
                                i++;
                            }
                        });

                        deferred.notify(100);

                        //== Download file in browser
                        downloadFileFromBlob([filedata], originalFilename);

                        deferred.resolve();
                    });
                }
            });

            //== Return
            return deferred;
        }

        var downloadFileFromBlob = (function () {
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            return function (data, fileName) {
                var blob = new Blob(data, {
                    type: "octet/stream"
                }),
                    url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = fileName;
                a.click();
                window.URL.revokeObjectURL(url);
            };
        }());

    }
}
function addTable() {
    clearBox("myDynamicTable")
    var myTableDiv = document.getElementById("myDynamicTable");

    var table = document.createElement('TABLE');
    table.border = '1';

    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);

    for (var i = 0; i < songs_to_download.length / 2; i++) {
        var tr = document.createElement('TR');
        tableBody.appendChild(tr);

        for (var j = 0; j < 3; j++) {
            var td = document.createElement('TD');
            td.width = '300';
            if (j === 0) {
                td.appendChild(document.createTextNode("Song: " + songs_to_download[i * 2 + 1]));
            }
            if (j === 1) {
                td.appendChild(document.createTextNode("Artist:" + songs_to_download[i * 2]));
            }
            if (j === 2) {
                if (Math.round(100 * download_info_array[i]) !== 100) {
                    td.appendChild(document.createTextNode("Percent: " + Math.round(100 * download_info_array[i]) + "%"));
                }
                else {
                    td.appendChild(document.createTextNode("Done!"));
                }
            }
            tr.appendChild(td);
        }
    }
    myTableDiv.appendChild(table);
}

function clearBox(elementID) {
    document.getElementById(elementID).innerHTML = "";
}
function songs_to_download_table(song_names) {
    clearBox("songs_to_download_table")
    var myTableDiv = document.getElementById("songs_to_download_table");

    var table = document.createElement('TABLE');
    table.border = '1';

    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);

    for (var i = 0; i < song_names.length / 2; i++) {
        var tr = document.createElement('TR');
        tableBody.appendChild(tr);

        for (var j = 0; j < 3; j++) {
            var td = document.createElement('TD');
            td.width = '300';
            if (j === 0) {
                td.appendChild(document.createTextNode("Song: " + song_names[i * 2 + 1]));
            }
            if (j === 1) {
                td.appendChild(document.createTextNode("Artist:" + song_names[i * 2]));
            }
            if (j === 2) {
                let download_song_btn = document.createElement("input");

                download_song_btn.setAttribute('value', select_download_songs_array[i])
                download_song_btn.style.background = select_download_songs_array[i] ? '#00FF00' : '#FF0000'
                download_song_btn.setAttribute('type', 'button');
                download_song_btn.setAttribute('id', i)
                download_song_btn.addEventListener('click', function () {
                    select_download_songs_array[download_song_btn.id] = !select_download_songs_array[download_song_btn.id]
                    songs_to_download_table(song_names)
                })
                td.appendChild(download_song_btn);
            }
            tr.appendChild(td);
        }
    }
    myTableDiv.appendChild(table);
}
