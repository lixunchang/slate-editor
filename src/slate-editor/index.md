# SlateEditor

This is an example component.

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
  console.log('Editore', Editor)
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
