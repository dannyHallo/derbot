# Overview

Caddy service is used on the server side, to redirect http requests into https requests

# Crt keys

ignore the pub & private keys, they can be safely obtained at alicloud
https://yundunnext.console.aliyun.com/?spm=5176.ecscore_keyPair.console-base_help.58.53624df55lPxGN&p=cas
use Apache format (crt/key)
then three files can be downloaded
domainname.top_chain.crt
domainname.top_public.crt
domainname.top.key

paste them to ./frp folder
only domainname.top_public.crt and domainname.top.key are needed actually

# Installation

1. Clone the repository.
2. Install the dependencies from the `requirements.txt` file:

```bash
pip install -r requirements.txt
```

## On MacOS

```bash
brew install frpc
```

## On Windows

the package comes with a prebuilt version of frpc, find it from .vscode/tasks.json

# Server Side

Create a new screen session so that frps won't be closed after ssh session has been ended

```bash
screen -S frps_session
```

Then start frps in this newly created session

```bash
./frps -c frps.toml
```

press Ctrl + A then D to leave this screen session, and back to the default session

you can later reconnect to the frps session by:

```bash
screen -r frps_session
```
