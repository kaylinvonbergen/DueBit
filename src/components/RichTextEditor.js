
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

const MAX_LENGTH = 3000;

function getLength(doc) {
  return doc.textBetween(
    0,
    doc.content.size,
    '\n'
  ).length;
}

function parseNotes(value) {
  if (!value) {
    return { type: 'doc', content: [{ type: 'paragraph' }] };
  }

  try {
    return JSON.parse(value);
  } catch {
    return { type: 'doc', content: [{ type: 'paragraph' }] };
  }
}

export default function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: parseNotes(value),

    editorProps: {
      attributes: {
        class: 'notes-editor-content',
        'aria-label': 'Task notes',
      },
      handlePaste(view, event) {
        const text = event.clipboardData?.getData('text/plain');

        if (!text) return false;

        const currentLength = getLength(view.state.doc);
        const selectedLength = view.state.doc.textBetween(
          view.state.selection.from,
          view.state.selection.to,
          '\n'
        ).length;

        const remaining = MAX_LENGTH - currentLength + selectedLength;

        if (remaining <= 0) return true;

        // Allow ordinary paste if it fits.
        if (text.length <= remaining) return false;

        // Truncate oversized plain-text paste.
        view.dispatch(
          view.state.tr.insertText(
            text.slice(0, remaining)
          )
        );

        return true;
      },
    },

    onUpdate({ editor }) {
      onChange(JSON.stringify(editor.getJSON()));
    },
  });

  useEffect(() => {
    if (!editor) return;

    const incoming = parseNotes(value);
    const current = JSON.stringify(editor.getJSON());

    if (current !== JSON.stringify(incoming)) {
      editor.commands.setContent(incoming, {
        emitUpdate: false,
      });
    }
  }, [editor, value]);

  if (!editor) return null;

  const length = getLength(editor.state.doc);

  function toggleFormat(action) {
    editor.chain().focus()[action]().run();
  }

  return (
    <div className="notes-editor">
      <div className="notes-toolbar">
        <button
          type="button"
          className={editor.isActive('bold') ? 'active' : ''}
          onClick={() => toggleFormat('toggleBold')}
          title="Bold"
        >
          <b>B</b>
        </button>

        <button
          type="button"
          className={editor.isActive('italic') ? 'active' : ''}
          onClick={() => toggleFormat('toggleItalic')}
          title="Italic"
        >
          <i>I</i>
        </button>

        <button
          type="button"
          className={editor.isActive('bulletList') ? 'active' : ''}
          onClick={() => toggleFormat('toggleBulletList')}
          title="Bullet list"
        >
          •
        </button>

        <button
          type="button"
          className={editor.isActive('orderedList') ? 'active' : ''}
          onClick={() => toggleFormat('toggleOrderedList')}
          title="Numbered list"
        >
          1.
        </button>
      </div>

      <EditorContent editor={editor} />

      <div className="notes-counter">
        {length.toLocaleString()} / {MAX_LENGTH.toLocaleString()}
      </div>
    </div>
  );
}
