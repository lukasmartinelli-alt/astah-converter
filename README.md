## Astah to PNG converter

A simple web interface and API that can export diagrams as images from
a [Astah](http://astah.net/) project files.

![Astah to PNG converter web interface](screenshot.png)

## API

There is a single ressource `project` for an Astah project file.

### Upload project file

Make a POST request to the `projects` endpoint with a file upload named `upload`.

```
curl -F "upload=@UseCaseDiagram.astah" http://localhost:3000/projects
```

```
{
    "url": "projects/ee6a3d12a3b22305272badb76f39fe738c97eb3d",
    "exports:" [
        {
            "url": "projects/ee6a3d12a3b22305272badb76f39fe738c97eb3d?file=UseCase Diagram.png",
            "filename": "UseCase Diagram.png"
        }
    ]
}
```

### Download exported image

Make a GET request to the exported file.

```
curl -O http://localhost:3000/projects/ee6a3d12a3b22305272badb76f39fe738c97eb3d?file=UseCase Diagram.png"
```

## Deployment

The Dockerfile contains [Astah](http://astah.net/faq/professional/how-to-run-astah-on-linux), Oracle JDK7 and the latest Node.

I have already setup an automated build `lukasmartinelli/astah-converter`
which you can use.

```bash
docker pull lukasmartinelli/astah-converter
```

Or you can clone the repo and build the docker image yourself.

```bash
docker build -t lukasmartinelli/astah-converter .
```

Now you can run the image.

```bash
docker run -p 3000:3000 -it lukasmartinelli/astah-converter
```
