"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Link as LinkIcon,
  Undo,
  Redo,
  Palette,
  Braces,
  Copy,
  Check,
  FileText,
} from "lucide-react";

// ESP Variables that can be inserted
const ESP_VARIABLES = [
  { label: "User's Full Name", value: "{{user.name}}" },
  { label: "User's First Name", value: "{{user.first_name}}" },
  { label: "User's Last Name", value: "{{user.last_name}}" },
  { label: "User's Email", value: "{{user.email}}" },
  { label: "Student's Schedule", value: "{{schedule}}" },
  { label: "Teacher's Schedule", value: "{{teacher_schedule}}" },
  { label: "Class Name", value: "{{class.name}}" },
  { label: "Class Location", value: "{{class.location}}" },
  { label: "Class Time", value: "{{class.time}}" },
];

// Color options for text
const TEXT_COLORS = [
  { label: "Default", value: "inherit" },
  { label: "Red", value: "#dc2626" },
  { label: "Orange", value: "#ea580c" },
  { label: "Green", value: "#16a34a" },
  { label: "Blue", value: "#2563eb" },
  { label: "Purple", value: "#9333ea" },
  { label: "Navy", value: "#1e3a8a" },
];

interface ToolbarProps {
  editor: Editor | null;
  onInsertVariable: (variable: string) => void;
}

function Toolbar({ editor, onInsertVariable }: ToolbarProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", previousUrl || "https://");

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 px-2 py-1.5">
      {/* Text Formatting */}
      <div className="flex items-center gap-0.5 border-r border-slate-200 pr-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`h-8 w-8 p-0 ${editor.isActive("bold") ? "bg-slate-200" : ""}`}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`h-8 w-8 p-0 ${editor.isActive("italic") ? "bg-slate-200" : ""}`}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`h-8 w-8 p-0 ${editor.isActive("underline") ? "bg-slate-200" : ""}`}
          title="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`h-8 w-8 p-0 ${editor.isActive("strike") ? "bg-slate-200" : ""}`}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
      </div>

      {/* Lists */}
      <div className="flex items-center gap-0.5 border-r border-slate-200 pr-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`h-8 w-8 p-0 ${editor.isActive("bulletList") ? "bg-slate-200" : ""}`}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`h-8 w-8 p-0 ${editor.isActive("orderedList") ? "bg-slate-200" : ""}`}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      {/* Link */}
      <div className="flex items-center gap-0.5 border-r border-slate-200 pr-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={setLink}
          className={`h-8 w-8 p-0 ${editor.isActive("link") ? "bg-slate-200" : ""}`}
          title="Insert Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Color */}
      <div className="relative flex items-center gap-0.5 border-r border-slate-200 pr-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="h-8 w-8 p-0"
          title="Text Color"
        >
          <Palette className="h-4 w-4" />
        </Button>
        {showColorPicker && (
          <div className="absolute left-0 top-full z-10 mt-1 rounded-md border bg-white p-2 shadow-lg">
            <div className="grid grid-cols-4 gap-1">
              {TEXT_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => {
                    if (color.value === "inherit") {
                      editor.chain().focus().unsetColor().run();
                    } else {
                      editor.chain().focus().setColor(color.value).run();
                    }
                    setShowColorPicker(false);
                  }}
                  className="h-6 w-6 rounded border border-slate-200 transition-transform hover:scale-110"
                  style={{ backgroundColor: color.value === "inherit" ? "#fff" : color.value }}
                  title={color.label}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Variable Insert */}
      <div className="flex items-center gap-0.5 border-r border-slate-200 pr-2">
        <Select onValueChange={onInsertVariable}>
          <SelectTrigger className="h-8 w-auto gap-1 border-0 bg-transparent px-2 text-xs font-medium hover:bg-slate-100">
            <Braces className="h-4 w-4" />
            <span className="hidden sm:inline">Variable</span>
          </SelectTrigger>
          <SelectContent>
            {ESP_VARIABLES.map((v) => (
              <SelectItem key={v.value} value={v.value} className="text-xs">
                {v.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Undo/Redo */}
      <div className="flex items-center gap-0.5">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="h-8 w-8 p-0"
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="h-8 w-8 p-0"
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  highlightVariables: boolean;
  className?: string;
}

export function RichTextEditor({
  content,
  onChange,
  highlightVariables,
  className = "",
}: RichTextEditorProps) {
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline",
        },
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          class: 'bg-yellow-200',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[300px] p-4",
      },
    },
  });

  // Update content when it changes externally
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const handleInsertVariable = useCallback(
    (variable: string) => {
      if (editor) {
        editor.chain().focus().insertContent(variable).run();
      }
    },
    [editor]
  );

  const handleCopyHtml = async () => {
    if (editor) {
      await navigator.clipboard.writeText(editor.getHTML());
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2000);
    }
  };

  const handleCopyPlainText = async () => {
    if (editor) {
      await navigator.clipboard.writeText(editor.getText());
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  return (
    <div className={`flex flex-col rounded-lg border border-slate-200 bg-white ${className}`}>
      <Toolbar editor={editor} onInsertVariable={handleInsertVariable} />

      {/* Editor Content */}
      <div className="relative flex-1 overflow-auto">
        <EditorContent editor={editor} />
      </div>

      {/* Copy Buttons */}
      <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-3 py-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopyHtml}
          className="gap-1.5 text-xs"
        >
          {copiedHtml ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          Copy HTML
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopyPlainText}
          className="gap-1.5 text-xs"
        >
          {copiedText ? <Check className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
          Copy Plain Text
        </Button>
      </div>
    </div>
  );
}

/**
 * Convert plain text with variables to HTML for the editor
 */
export function textToHtml(text: string): string {
  // Convert newlines to <p> tags
  const paragraphs = text.split(/\n\n+/);
  return paragraphs
    .map((p) => {
      // Convert single newlines to <br>
      const withBreaks = p.replace(/\n/g, "<br>");
      return `<p>${withBreaks}</p>`;
    })
    .join("");
}

/**
 * Strip HTML tags to get plain text
 */
export function htmlToText(html: string): string {
  if (typeof document === "undefined") return html;
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}
