import Editor from '@monaco-editor/react';
import { useEffect, useState } from 'react';
import { useActiveFileTabStore } from '../../../store/activeFileTabStore';
import { useEditorSocketStore } from '../../../store/editorSocketStore';
import { useChatStore } from '../../../store/chatStore';
import { extensionToFileType } from '../../../utils/extensionToFileType';

export const EditorComponent = () => {
    const [editorState, setEditorState] = useState({ theme: null });
    const { activeFileTab } = useActiveFileTabStore();
    const { editorSocket, emitCodeUpdate } = useEditorSocketStore();
    const { currentChannel } = useChatStore();
    let timerId = null;

    async function downloadTheme() {
        const response = await fetch('/Dracula.json');
        const data = await response.json();
        setEditorState({ ...editorState, theme: data });
    }

    function handleEditorTheme(editor, monaco) {
        monaco.editor.defineTheme('dracula', editorState.theme);
        monaco.editor.setTheme('dracula');
    }

    function handleChange(value) {
        if (timerId) clearTimeout(timerId);
        
        // Immediate local update
        useActiveFileTabStore.getState().setActiveFileTab(
            activeFileTab.path,
            value,
            activeFileTab.extension
        );

        timerId = setTimeout(() => {
            // Save to file system
            editorSocket.emit("writeFile", {
                data: value,
                pathToFileOrFolder: activeFileTab.path
            });
            
            // Broadcast to collaborators
            emitCodeUpdate({
                path: activeFileTab.path,
                content: value,
                extension: activeFileTab.extension,
                channelId: currentChannel
            });
        }, 2000);
    }

    useEffect(() => {
        downloadTheme();
        
        // Listen for remote code updates
        const handleCodeUpdate = (data) => {
            if (data.path === activeFileTab?.path) {
                useActiveFileTabStore.getState().setActiveFileTab(
                    data.path,
                    data.content,
                    data.extension
                );
            }
        };

        editorSocket?.on('CodeUpdate', handleCodeUpdate);
        return () => {
            editorSocket?.off('CodeUpdate', handleCodeUpdate);
        };
    }, [activeFileTab?.path]);

    return (
        <>
            {editorState.theme && (
                <Editor 
                    width={'100%'}
                    options={{
                        fontSize: 18,
                        fontFamily: 'monospace',
                        minimap: { enabled: true },
                        scrollBeyondLastLine: false
                    }}
                    language={extensionToFileType(activeFileTab?.extension)}
                    onChange={handleChange}
                    value={activeFileTab?.value || '// Welcome to the playground'}
                    onMount={handleEditorTheme}
                />
            )}
        </>
    );
};