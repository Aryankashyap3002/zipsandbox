import { useParams } from "react-router-dom";
import { EditorComponent } from "../components/molecules/EditorComponent/EditorComponent";
import { TreeStructure } from "../components/organisms/TreeStructure/TreeStructure";
import { useEffect, useState } from "react";
import { useTreeStructureStore } from "../store/treeStructureStore";
import { useEditorSocketStore } from "../store/editorSocketStore";
import { io } from "socket.io-client";
import { BrowserTerminal } from "../components/molecules/BrowserTerminal/BrowserTerminal";
import { useTerminalSocketStore } from "../store/terminalSocketStore";
import { Browser } from "../components/organisms/Browser/Browser";
import { Button } from "antd";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { WorkspaceSidebar, FILE_EXPLORER_TOGGLE_EVENT_NAME } from "@/components/organisms/Workspace/WorkspaceSidebar";

export const ProjectPlayground = () => {
    const { projectId: projectIdFromUrl } = useParams();
    const { setProjectId, projectId } = useTreeStructureStore();
    const { setEditorSocket } = useEditorSocketStore();
    const { terminalSocket, setTerminalSocket } = useTerminalSocketStore();
    const [loadBrowser, setLoadBrowser] = useState(false);
    const [showFileExplorer, setShowFileExplorer] = useState(true);

    useEffect(() => {
        if (projectIdFromUrl) {
            setProjectId(projectIdFromUrl);
            const editorSocketConn = io(`${import.meta.env.VITE_BACKEND_URL}/editor`, {
                query: { projectId: projectIdFromUrl }
            });

            try {
                const ws = new WebSocket("ws://localhost:4000/terminal?projectId=" + projectIdFromUrl);
                setTerminalSocket(ws);
            } catch (error) {
                console.log("error in ws", error);
            }

            setEditorSocket(editorSocketConn);
        }
    }, [setProjectId, projectIdFromUrl, setEditorSocket, setTerminalSocket]);

    // Add event listener for the toggle event
    useEffect(() => {
        const handleFileExplorerToggle = () => {
            setShowFileExplorer(prev => !prev);
        };

        // Listen for the custom event
        document.addEventListener(FILE_EXPLORER_TOGGLE_EVENT_NAME, handleFileExplorerToggle);

        // Clean up the event listener when component unmounts
        return () => {
            document.removeEventListener(FILE_EXPLORER_TOGGLE_EVENT_NAME, handleFileExplorerToggle);
        };
    }, []);

    return (
        <div className="flex h-screen bg-[#1e1e2f] overflow-hidden">
            <div className="h-full flex-shrink-0">
                <WorkspaceSidebar />
            </div>

            {projectId && showFileExplorer && (
                <div
                    className="flex-shrink-0 overflow-auto animate-slide-in"
                    style={{
                        backgroundColor: "#1f1f2e",
                        paddingRight: "10px",
                        paddingTop: "0.3vh",
                        minWidth: "250px",
                        maxWidth: "25%",
                        height: "100%",
                        animation: "slideIn 0.2s ease-out"
                    }}
                >
                    <TreeStructure />
                </div>
            )}

            <div className="flex-grow h-full overflow-hidden">
                <Allotment>
                    <Allotment.Pane>
                        <div
                            className="flex flex-col h-full bg-[#1e1e2f]"
                        >
                            <Allotment vertical={true}>
                                <EditorComponent />
                                <BrowserTerminal />
                            </Allotment>
                        </div>
                    </Allotment.Pane>
                    <Allotment.Pane>
                        <div className="flex flex-col h-full bg-[#2e2f40] p-4">
                            <Button
                                onClick={() => setLoadBrowser(true)}
                                style={{
                                    backgroundColor: "#3b82f6",
                                    color: "#fff",
                                    border: "none",
                                    marginBottom: "12px"
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.backgroundColor = "#2563eb")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.backgroundColor = "#3b82f6")
                                }
                            >
                                Load my browser
                            </Button>
                            {loadBrowser && projectIdFromUrl && terminalSocket && (
                                <div className="h-full overflow-auto">
                                    <Browser projectId={projectIdFromUrl} />
                                </div>
                            )}
                        </div>
                    </Allotment.Pane>
                </Allotment>
            </div>
        </div>
    );
};

