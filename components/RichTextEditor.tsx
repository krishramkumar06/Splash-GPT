"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Link } from "@tiptap/extension-link";
import { Underline } from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { TextAlign } from "@tiptap/extension-text-align";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { Image } from "@tiptap/extension-image";
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
  ImageIcon,
  TableIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code,
} from "lucide-react";

// ESP Variables that can be inserted
const ESP_VARIABLES = [
  { label: "User's Full Name", value: "{{user.name}}" },
  { label: "User's ESP Web Site Username", value: "{{user.username}}" },
  { label: "User's First Name", value: "{{user.first_name}}" },
  { label: "User's Last Name", value: "{{user.last_name}}" },
  { label: "User-Specific Unsubscribe Link", value: "{{user.unsubscribe_link}}" },
  { label: "Student's Schedule for Program", value: "{{program.student_schedule}}" },
  { label: "Student's Schedule (No Rooms)", value: "{{program.student_schedule_norooms}}" },
  { label: "Teacher's Schedule for Program", value: "{{program.teacher_schedule}}" },
  { label: "Teacher's Schedule with Dates", value: "{{program.teacher_schedule_dates}}" },
  { label: "Teacher/Moderator's Schedule", value: "{{program.teachermoderator_schedule}}" },
  { label: "Teacher/Moderator's Schedule with Dates", value: "{{program.teachermoderator_schedule_dates}}" },
  { label: "Moderator's Schedule for Program", value: "{{program.moderator_schedule}}" },
  { label: "Moderator's Schedule with Dates", value: "{{program.moderator_schedule_dates}}" },
  { label: "Volunteer's Schedule for Program", value: "{{program.volunteer_schedule}}" },
  { label: "Volunteer's Schedule with Dates", value: "{{program.volunteer_schedule_dates}}" },
  { label: "Transcript (Classes & Descriptions)", value: "{{program.transcript}}" },
  { label: "Confirmation Receipt for Program", value: "{{program.receipt}}" },
  { label: "User's Full/Nearly-Full Classes", value: "{{program.full_classes}}" },
  { label: "Public URL", value: "{{request.public_url}}" },
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

    editor.chain().focus().extendMarkRange("link").setLink({ href: url, target: "_blank" }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;

    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (readerEvent) => {
          const url = readerEvent.target?.result as string;
          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        };
        reader.readAsDataURL(file);
      }
    };

    input.click();
  }, [editor]);

  const insertTable = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted px-2 py-1.5">
      {/* Text Formatting */}
      <div className="flex items-center gap-0.5 border-r border-border pr-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`h-8 w-8 p-0 ${editor.isActive("bold") ? "bg-accent" : ""}`}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`h-8 w-8 p-0 ${editor.isActive("italic") ? "bg-accent" : ""}`}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`h-8 w-8 p-0 ${editor.isActive("underline") ? "bg-accent" : ""}`}
          title="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`h-8 w-8 p-0 ${editor.isActive("strike") ? "bg-accent" : ""}`}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
      </div>

      {/* Lists */}
      <div className="flex items-center gap-0.5 border-r border-border pr-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`h-8 w-8 p-0 ${editor.isActive("bulletList") ? "bg-accent" : ""}`}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`h-8 w-8 p-0 ${editor.isActive("orderedList") ? "bg-accent" : ""}`}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      {/* Media */}
      <div className="flex items-center gap-0.5 border-r border-border pr-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addImage}
          className="h-8 w-8 p-0"
          title="Insert Image"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={insertTable}
          className={`h-8 w-8 p-0 ${editor.isActive("table") ? "bg-accent" : ""}`}
          title="Insert Table"
        >
          <TableIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Link */}
      <div className="flex items-center gap-0.5 border-r border-border pr-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={setLink}
          className={`h-8 w-8 p-0 ${editor.isActive("link") ? "bg-accent" : ""}`}
          title="Insert Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Alignment */}
      <div className="flex items-center gap-0.5 border-r border-border pr-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`h-8 w-8 p-0 ${editor.isActive({ textAlign: "left" }) ? "bg-accent" : ""}`}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`h-8 w-8 p-0 ${editor.isActive({ textAlign: "center" }) ? "bg-accent" : ""}`}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`h-8 w-8 p-0 ${editor.isActive({ textAlign: "right" }) ? "bg-accent" : ""}`}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Color */}
      <div className="relative flex items-center gap-0.5 border-r border-border pr-2">
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
          <div className="absolute left-0 top-full z-10 mt-1 rounded-md border border-border bg-card p-2 shadow-lg">
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
                  className="h-6 w-6 rounded border border-border transition-transform hover:scale-110"
                  style={{ backgroundColor: color.value === "inherit" ? "transparent" : color.value }}
                  title={color.label}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Variable Insert */}
      <div className="flex items-center gap-0.5 border-r border-border pr-2">
        <Select onValueChange={onInsertVariable}>
          <SelectTrigger className="h-8 w-auto gap-1 border-0 bg-transparent px-2 text-xs font-medium hover:bg-accent">
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
  const [showHtmlSource, setShowHtmlSource] = useState(false);
  const [htmlSource, setHtmlSource] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          class: "text-blue-600 underline cursor-pointer",
          target: "_blank",
          rel: "noopener noreferrer",
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
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-border bg-muted px-3 py-2 font-semibold',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-border px-3 py-2',
        },
      }),
      Image.configure({
        inline: true,
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded',
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

  const toggleHtmlSource = useCallback(() => {
    if (!editor) return;

    if (!showHtmlSource) {
      // Switching to HTML view
      setHtmlSource(editor.getHTML());
      setShowHtmlSource(true);
    } else {
      // Switching back to editor view
      editor.commands.setContent(htmlSource);
      onChange(htmlSource);
      setShowHtmlSource(false);
    }
  }, [editor, showHtmlSource, htmlSource, onChange]);

  // Calculate character and word count
  const stats = editor ? {
    characters: editor.storage.characterCount?.characters() || editor.getText().length,
    words: editor.getText().split(/\s+/).filter(word => word.length > 0).length,
  } : { characters: 0, words: 0 };

  return (
    <div className={`flex flex-col rounded-lg border border-border bg-card ${className}`}>
      <Toolbar editor={editor} onInsertVariable={handleInsertVariable} />

      {/* Editor Content */}
      <div className="relative flex-1 overflow-auto">
        {showHtmlSource ? (
          <textarea
            value={htmlSource}
            onChange={(e) => setHtmlSource(e.target.value)}
            className="h-full w-full min-h-[300px] p-4 font-mono text-xs focus:outline-none resize-none bg-card text-foreground"
            spellCheck={false}
          />
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>

      {/* Bottom Bar with Stats and Actions */}
      <div className="flex items-center justify-between gap-2 border-t border-border bg-muted px-3 py-2">
        {/* Character/Word Count */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>{stats.characters} characters</span>
          <span>{stats.words} words</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={toggleHtmlSource}
            className="gap-1.5 text-xs"
          >
            <Code className="h-3 w-3" />
            {showHtmlSource ? "Visual Editor" : "HTML Source"}
          </Button>
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
    </div>
  );
}

/**
 * Convert plain text URLs to HTML anchor tags (only for plain text, not HTML)
 */
function linkify(text: string): string {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
}

/**
 * Convert plain text with variables to HTML for the editor
 */
export function textToHtml(text: string): string {
  // Check if text already contains HTML tags (like <p>, <a>, <ul>, etc.)
  const hasHtmlTags = /<[^>]+>/g.test(text);

  // If it's already HTML-formatted, return as-is (don't linkify)
  if (hasHtmlTags) {
    return text;
  }

  // For plain text templates: linkify URLs and convert newlines
  const linkedText = linkify(text);

  // Convert newlines to <p> tags
  const paragraphs = linkedText.split(/\n\n+/);
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
