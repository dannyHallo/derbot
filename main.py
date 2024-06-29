from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import fastapi_poe as fp
import logging

app = FastAPI()

# Serve static files from the "static" directory
app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")

api_key = "mWYQc0gS8ETZqZH9iMfk2ssMFizTwDjHdqn5CTlAvus"
bot_name = "MrAverage"

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@app.get("/", response_class=HTMLResponse)
async def read_form(request: Request):
    logger.debug("GET / request received")
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/hello.html", response_class=HTMLResponse)
async def read_hello(request: Request):
    logger.debug("GET /hello.html request received")
    return templates.TemplateResponse("hello.html", {"request": request})


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    conversation_history = []
    try:
        while True:
            data = await websocket.receive_text()
            logger.debug(f"Received WebSocket message: {data}")

            # response for the clear screen request
            if data == "[CLS-REQ]":
                conversation_history.clear()
                logger.info("Conversation history cleared")
                # answer to the client that the clear screen has been done at the server side
                await websocket.send_text("[CLS-RSP]")
                continue

            conversation_history.append(
                fp.ProtocolMessage(role="user", content=data))
            bot_response = ""
            async for partial in fp.get_bot_response(messages=conversation_history, bot_name=bot_name, api_key=api_key):
                if partial.text:
                    bot_response += partial.text
                    await websocket.send_text(partial.text)
            await websocket.send_text("[END]")
            conversation_history.append(
                fp.ProtocolMessage(role="bot", content=bot_response))
    except WebSocketDisconnect:
        logger.info("Client disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
