import React, { useState, FC, useMemo, useEffect, useRef, KeyboardEvent } from 'react'
import { Path, Transforms } from 'slate'
import { ReactEditor, RenderElementProps, useSlate } from 'slate-react'
import { isHotkey } from 'is-hotkey'
import { getSelection } from '../../../utils/selection'
import selectionBound from '../../../utils/selectionBound'
import {
  getTableCellNode,
  isCanEditInTable,
  setTableNodeOrigin,
} from '../../../utils/util'
import { ContextMenu } from './ContextMenu/ContextMenu'
import './index.less'

const TableComponent = (props) => {
  const { children, element } = props
  const tableRef = useRef(null)
  const [startPath, setStartPath] = useState(null)
  const [selectCells, setSelectCells] = useState([])
  const [bound, setBound] = useState({
    x: 0,
    y: 0,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  })
  const [showWrap, setShowWrap] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [menuPosition, setMenuPosition] = useState({
    left: -9999,
    top: -9999,
  })

  const editor = useSlate()

  // useEffect(() => {
  //   const handleKeydown = (e) => {
  //     const editorDom = ReactEditor.toDOMNode(editor, editor)

  //     if (
  //       !isCanEditInTable(editor) &&
  //       !isHotkey(['delete', 'backspace'], e) &&
  //       editorDom.getAttribute('contenteditable') === 'true'
  //     ) {
  //       // 非 delete backspace 按键时
  //       editorDom.setAttribute('contenteditable', 'false')
  //       Promise.resolve()
  //         .then(() => editorDom.setAttribute('contenteditable', 'true'))
  //         .catch(() => {})
  //     }
  //   }
  //   editor.on('keydown', handleKeydown)

  //   return () => {
  //     editor.off('keydown', handleKeydown)
  //   }
  // }, [editor])

  useEffect(() => {
    const mousedownCallback = (e) => {
      const isTable = e.target && tableRef.current?.contains(e.target)
      if (!isTable || e.button !== 2) {
        // 不在表格位置 || 不是鼠标右键
        // collapse 选区
        Transforms.collapse(editor)
        setShowWrap(false)
        setShowMenu(false)
        // setSelectCells([])
      }
    }
    const mouseupCallback = () => {
      setStartPath(null)
    }

    const blurCallback = () => {
      setShowMenu(false)
      // setSelectCells([])
    }

    // const reset = () => {
    //   setShowWrap(false)
    //   setSelectCells([])
    // }
    console.log('editor====>', editor)
    if (editor) {
      // editor.onMouseDown(mousedownCallback)
      // editor.onBlur(blurCallback)
      // editor.onResetTableSelection(reset)
      window.addEventListener('mousedown', mousedownCallback)
      tableRef.current?.addEventListener('blur', blurCallback)
      // editor.addEventListener('resetTableSelection', reset)
      window.addEventListener('mouseup', mouseupCallback)
    }
    return () => {
      window.removeEventListener('mousedown', mousedownCallback)
      // tableRef.current&&tableRef.current?.removeEventListener('blur', blurCallback)
      // editor.removeEventListener('resetTableSelection', reset)
      window.removeEventListener('mouseup', mouseupCallback)
    }
  }, [editor])

  useEffect(() => {
    // 注意避免死循环
    if (!editor || !element || element.originTable) return
    const tablePath = ReactEditor.findPath(editor, element)
    setTableNodeOrigin(editor, tablePath)
  }, [editor, element])

  useEffect(() => {
    if (!editor || selectCells.length < 2) return
    setBound(selectionBound(editor, selectCells))
  }, [editor, editor.children, selectCells])

  useEffect(() => {
    if (selectCells.length < 2) return
    setShowWrap(true)
  }, [selectCells])

  useEffect(() => {
    editor.tableState = {
      showSelection: showWrap,
      selection: selectCells,
    }
  }, [editor, selectCells, showWrap])

  const updateSelection = useMemo(
    () => (endPath) => {
      if (!startPath) return
      if (Path.equals(startPath, endPath)) {
        // 当选区为一个
        setShowWrap(false)
        return
      }
      setSelectCells(
        getSelection(editor, startPath, endPath, element),
      )
    },
    [editor, element, startPath],
  )

  return (
    <>
      <table
        ref={tableRef}
        className={`${'slate-table'} ${'yt-e-table'} ${showWrap ? 'ye-e-table-selected' : ''}`}
        onDragStart={(e) => e.preventDefault()}
        onMouseDown={(e) => {
          const node = getTableCellNode(editor, e.target)
          if (!node || e.button !== 0) return
          setStartPath(node[1])
        }}
        onMouseLeave={() => {
          startPath && setShowWrap(false)
        }}
        onMouseMove={(e) => {
          if (startPath) {
            const endNode = getTableCellNode(editor, e.target)
            if (endNode[1]) updateSelection(endNode[1])
          }
        }}
        onContextMenu={(e) => {
          e.preventDefault()
          console.log('onContextMenu', e)
          setShowMenu(true)
          setMenuPosition({
            left: e.clientX,
            top: e.clientY,
          })
        }}
      >
        <tbody>{children}</tbody>
      </table>
      <div
        className={"yt-e-table-selection"}
        style={{
          display: `${showWrap ? 'block' : 'none'}`,
          top: `${bound.y}px`,
          left: `${bound.x}px`,
          width: `${bound.right - bound.left}px`,
          height: `${bound.bottom - bound.top}px`,
        }}
      />
      <ContextMenu
        visible={showMenu}
        position={menuPosition}
        editor={editor}
        selectCells={selectCells}
      />
    </>
  )
}

export function RenderTable(props) {
  return (
    <div className={"yt-e-table-wrap"}>
      <TableComponent {...props} />
    </div>
  )
}
