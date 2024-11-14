import React, { useState, useEffect } from "react";

const JournalEntryForm = ({ onSubmit, currentEntry }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => { 
    if (currentEntry) {
      setTitle(currentEntry.title);
      setContent(currentEntry.content);
    }
  }, [currentEntry]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content });
    setTitle("");
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Content:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <button type="submit">
        {currentEntry ? "Edit Entry" : "Save Entry"}
      </button>
    </form>
  );
};

export default JournalEntryForm;
