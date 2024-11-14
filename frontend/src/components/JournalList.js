import React from "react";

const JournalList = ({ journals, onEdit, onDelete }) => {
  return (
    <div>
      <h2>Journal Entries</h2>
      {journals.length === 0 ? (
        <p>No journal entries found.</p>
      ) : (
        journals.map((journal) => (
          <div key={journal._id}>
            <h3>{journal.title}</h3>
            <p>{journal.content}</p>
            <small>
              Created on: {new Date(journal.createdAt).toLocaleString()}
            </small>
            <br />
            <button onClick={() => onEdit(journal._id)}>Edit</button>
            <button onClick={() => onDelete(journal._id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
};

export default JournalList;



