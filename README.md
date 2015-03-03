## astah

A simple API that can export diagrams as images from an Astah [http://astah.net/] project file.

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
    "files:" [
        {
            "url": "projects/ee6a3d12a3b22305272badb76f39fe738c97eb3d?file=UseCase Diagram.png"
        }
    ]
}
```

### Download exported image

Make a GET request to the exported file.

```
curl -O http://localhost:3000/projects/ee6a3d12a3b22305272badb76f39fe738c97eb3d?file=UseCase Diagram.png"
```
