from flask import Flask, request, send_file, send_from_directory, jsonify
import pytube
import os
import tempfile

app = Flask(__name__, static_url_path='', static_folder='static')

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/download', methods=['POST'])
def download_video():
    data = request.json
    url = data['url']
    format = data['format']
    resolution = data['resolution']
    try:
        youtube = pytube.YouTube(url)
        if format == 'mp4':
            video = youtube.streams.filter(file_extension='mp4', res=resolution).first()
        else:  # mp3
            video = youtube.streams.filter(only_audio=True).first()
        
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4' if format == 'mp4' else '.mp3') as tmpfile:
            video.download(filename=tmpfile.name)
            tmpfile_path = tmpfile.name
        
        return send_file(tmpfile_path, as_attachment=True, attachment_filename=os.path.basename(tmpfile_path))
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
