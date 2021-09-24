const markdownText = `
# Docs

### Methods

#### /db/:route

    [GET] http://localhost:3000/db/:route

    Authorization: jwt tokenValue

#### /db/query/:route

    [GET] http://localhost:3000/db/query/:route

    Authorization: jwt tokenValue

#### /db/set/:route

    [POST] http://localhost:3000/db/set/:route
    
    content-type: application/json
    Authorization: jwt tokenValue

    {
        "name": "Phil",
        "surName": "Spenser",
        "age": 50
    }

#### /db/merge/:route

    [POST] http://localhost:3000/db/merge/:route
    
    content-type: application/json
    Authorization: jwt tokenValue

    {
        "name": "Phil",
        "surName": "Spenser",
        "age": 50
    }

#### /db/delete/:route

    [GET] http://localhost:3000/db/delete/:route

    Authorization: jwt tokenValue

#### /auth/:site/:pass

    [GET] http://localhost:3000/auth/:site/:pass

#### /db/reload

    [GET] http://localhost:3000/db/reload

    Authorization: jwt tokenValue

### Rights

    "tokenRights": {
        "tokenMaster": [
            "/"
        ],
        "token12121212": [
            "/site1",
            "/admin"
        ],
        "token222222222222": [
            "/site2",
            "/test2"
        ],
        "token3232234": [
            "/site2/users",
            "/site1/users",
            "/test3"
        ],
        "GEN_12121": [
            "/site4"
        ]
    }

### Init DB

    {
        "auth": {
            "lowback": {
                "12345678": "tokenMaster"
            },
            "site2": {
                "1234567890": {
                    "lowback": "tokenMaster",
                    "site2": "token3243243243232"
                }
            },
            "site3": {
                "mynewpass33": "token324324324111111111"
            },
            "site4": {
                "12345678": "GEN_12121"
            }
        },
        "tokenRights": {
            "tokenMaster": [
                "/"
            ],
            "token12121212": [
                "/site1",
                "/admin"
            ],
            "token222222222222": [
                "/site2",
                "/test2"
            ],
            "token3232234": [
                "/site2/users",
                "/site1/users",
                "/test3"
            ],
            "GEN_12121": [
                "/site4"
            ]
        }
    }

### Pages

- [Auth](/)
- [Docs](/docs)
- [Admin](/admin)

`

const converter = new showdown.Converter();

const html = converter.makeHtml(markdownText);

$('.main-block').html(html)