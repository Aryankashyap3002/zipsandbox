import { useEffect, useRef } from "react";
import { Input, Row } from "antd";
import { useEditorSocketStore } from "../../../store/editorSocketStore";
import { usePortStore } from "../../../store/portStore";
import { ReloadOutlined } from "@ant-design/icons";

export const Browser = ({ projectId }) => {
    console.log("Entering browser");

    const browserRef = useRef(null);
    const { port } = usePortStore();
    const { editorSocket } = useEditorSocketStore();

    useEffect(() => {
        if(!port) {
            editorSocket?.emit("getPort", {
                containerName: projectId
            })
        }
    }, [port, editorSocket, projectId]);

    // Listen for file write success events and automatically refresh
    useEffect(() => {
        if (!editorSocket) return;

        const handleWriteFileSuccess = (data) => {
            console.log("Write file success detected", data);
            handleRefresh();
        };

        editorSocket.on("writeFileSuccess", handleWriteFileSuccess);

        return () => {
            editorSocket.off("writeFileSuccess", handleWriteFileSuccess);
        };
    }, [editorSocket]);

    if(!port) {
        return <div>Loading....</div>
    }

    function handleRefresh() {
        console.log("handleRefresh called");
        if(browserRef.current) {
            const oldAddr = browserRef.current.src;
            console.log("from handlerefresh ", oldAddr);
            
            // Method 1: Force a complete iframe reload by setting src to empty and then back
            browserRef.current.src = "about:blank";
            setTimeout(() => {
                const timestamp = new Date().getTime();
                browserRef.current.src = `http://localhost:${port}?cacheBuster=${timestamp}`;
            }, 50);
            
            // Alternative Method 2: Use contentWindow.location.reload(true) to force a hard refresh
            // try {
            //     if (browserRef.current.contentWindow) {
            //         browserRef.current.contentWindow.location.reload(true);
            //     }
            // } catch (error) {
            //     console.error("Error refreshing iframe:", error);
            //     // Cross-origin error might occur, fallback to Method 1
            //     const timestamp = new Date().getTime();
            //     browserRef.current.src = `http://localhost:${port}?cacheBuster=${timestamp}`;
            // }
        } else {
            console.log("browserRef.current is null");
        }
    }

    return (
        <Row
            style={{
                backgroundColor: "#22212b"
            }}
        >
            <Input 
                style={{
                    width: "100%",
                    height: "30px",
                    color: "white",
                    fontFamily: "Fira Code",
                    backgroundColor: "#282a35",
                }}
                prefix={<ReloadOutlined onClick={handleRefresh} />}
                defaultValue={`http://localhost:${port}`}
            />

            <iframe 
                ref={browserRef}
                src={`http://localhost:${port}`}
                style={{
                    width: "100%",
                    height: "95vh",
                    border: "none"
                }}
            />
        </Row>
    )
}