let wsConn: WebSocket;
const wsHandlers: Map<string, Function> = new Map();

function webSocketOnMessage(data: any) {
  wsHandlers.forEach((handler) => {
    handler(data);
  });
}

export const initWebSocket = (wsUrl: string) => {
  if (wsConn) return;
  wsConn = new WebSocket(wsUrl);
  wsConn.onmessage = webSocketOnMessage;
  wsConn.onclose = () => {
    setTimeout(() => {
      initWebSocket(wsUrl);
    }, 2000);
  };
  wsConn.onerror = () => {
    setTimeout(() => {
      initWebSocket(wsUrl);
    }, 2000);
  };
};

export const addWsHandler = (name: string, handler: Function) => {
  wsHandlers.set(name, handler);
};

export const removeWsHandler = (name: string) => {
  wsHandlers.delete(name);
};
