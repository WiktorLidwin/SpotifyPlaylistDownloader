import spotipy
from spotipy.oauth2 import SpotifyClientCredentials #To access authorised Spotify data
import pprint
import sys
import webbrowser
import spotipy.util as util 
import unicodedata


export_data = []

def show_tracks(results):
    for i, item in enumerate(results['items']):
        track = item['track']
        export_data.append(track['artists'][0]['name'])
        export_data.append( track['name'])


def print_playlist(playlisttofind):

    for playlist in playlists['items']:
        if playlist['owner']['id'] == username:
            if playlist['name'] == playlisttofind:
                results = sp.user_playlist(username, playlist['id'], fields="tracks,next")
                tracks = results['tracks']
                show_tracks(tracks)
                while tracks['next']:
                    tracks = sp.next(tracks)
                    show_tracks(tracks)

def export_playlists(playlist):
    for playlist in playlists['items']:
        if playlist['owner']['id'] == username:
            export_data.append(playlist['name'])
            
client_id = "5a50ec388e014dda8c475275e7a39631"
client_secret = "58ce595bfef64775aea3a7a32bd83116"
client_credentials_manager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager) #spotify object to access API
playlists = sp.user_playlists(sys.argv[1])
username = sys.argv[1]
playlist = sys.argv[2]
print_playlist(playlist)
listToStr = ' '.join(map(str, export_data)) 
f = open("playlist.txt", "a")
y = []
for  i in export_data:
    z = unicodedata.normalize('NFKD', i).encode('ascii','ignore')
    a = str(z)[2:1]
    
    f.write(a)
    y.append(a)
f.close()
print (y)