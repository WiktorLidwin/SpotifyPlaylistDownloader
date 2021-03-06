import spotipy
from spotipy.oauth2 import SpotifyClientCredentials #To access authorised Spotify data
import pprint
import sys
import webbrowser
import spotipy.util as util 

export_data = []

def show_tracks(results):
    for i, item in enumerate(results['items']):
        track = item['track']
        export_data.append("   %d %32.32s %s" % (i, track['artists'][0]['name'], track['name']))


def print_tracks(playlist):

    for playlist in playlists['items']:
        if playlist['owner']['id'] == username:
            export_data.append()
            export_data.append(playlist['name'])
            export_data.append('  total tracks', playlist['tracks']['total'])
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
export_playlists(playlists)
listToStr = ' '.join(map(str, export_data)) 
f = open("test.txt", "a")
f.write(listToStr)
f.close()

print (export_data)