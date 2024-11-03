# SlateEditor

React 根据Slate.js二次开发的所见即所得的富文本Markdown编辑器，已实现文本、图片和表格相关功能，欢迎试用。

```jsx
import Editor from 'slate-editor';
import React, { useState } from 'react';

function App() {
  const [body, setBody] = useState(JSON.stringify([
  {
    type: 'paragraph',
    children: [
      {
        text: '',
      },
    ],
  },
]));
  const handleContentChange = (data) => {
    if (data !== body) {
      setBody(data);
    }
  };
  console.log('Editore', body)
  return (
    <div className="App">
      {
        body&&
        <Editor value={body} onChange={handleContentChange} isLoaded={true}/>
      }
    </div>
  );
}

export default App;
```
