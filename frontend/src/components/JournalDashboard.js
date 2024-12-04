import React, { useState, useEffect } from "react";
import JournalEntryForm from "./JournalEntryForm";
import JournalList from "./JournalList";

const JournalDashboard = ({ username, token }) => {
  const [journals, setJournals] = useState([]);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [viewAll, setViewAll] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredJournals, setFilteredJournals] = useState([]);

  //fetch all journal entries
  const fetchJournals = async () => {
    try {
      const response = await fetch(
        "http://localhost:1818/api/journals/allentries",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setJournals(data);
      } else {
        console.error("Failed to fetch journal entries.");
      }
    } catch (error) {
      console.error("Error fetching journals:", error);
    }
  };

  // Filter journal entries by date
  const handleFilter = () => {
    const filtered = journals.filter((journal) => {
      const createdAt = new Date(journal.createdAt);
      return createdAt >= new Date(startDate) && createdAt <= new Date(endDate);
    });
    setFilteredJournals(filtered);
  };

  // Calculate the count of entries per month
  const calculateEntriesPerMonth = (entries) => {
    const countPerMonth = {};

    entries.forEach((entry) => {
      const date = new Date(entry.createdAt);
      const monthYear = date.toLocaleString("default", {
        year: "numeric",
        month: "long",
      });

      if (countPerMonth[monthYear]) {
        countPerMonth[monthYear]++;
      } else {
        countPerMonth[monthYear] = 1;
      }
    });

    return countPerMonth;
  };

  const entriesPerMonth = calculateEntriesPerMonth(
    viewAll ? journals : filteredJournals
  );

  // Edit an existing journal entry
  const handleEdit = async (id, updatedEntry) => {
    try {
      const response = await fetch(
        `http://localhost:1818/api/journals/edit/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedEntry),
        }
      );

      if (response.ok) {
        setCurrentEntry(null); //clear the current entry after updating
        fetchJournals(); //refresh the journal list after editing an entry
      }
    } catch (error) {
      console.error("Error updating journal entry:", error);
    }
  };

  // Create a new journal entry
  const handleCreate = async (entry) => {
    try {
      const response = await fetch(
        "http://localhost:1818/api/journals/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(entry),
        }
      );

      if (response.ok) {
        fetchJournals(); //refresh the journal list after creating a new entry
      }
    } catch (error) {
      console.error("Error creating journal entry:", error);
    }
  };

  // Delete a journal entry
  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:1818/api/journals/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        fetchJournals(); //refresh the journal list after deleting an entry
      }
    } catch (error) {
      console.error("Error deleting journal entry:", error);
    }
  };

  useEffect(() => {
    fetchJournals();
  }, []);

  return (
    <div>
      <h1>Welcome, {username}!</h1>

      {/*toggle Button - switch between viewing all or filtering by date */}
      <button onClick={() => setViewAll(!viewAll)}>
        {viewAll ? "Filter by Date" : "View All Entries"}
      </button>

      {/*date filter inputs*/}
      {!viewAll && (
        <div>
          <h3>Filter Journal Entries by Date</h3>
          <label>
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label>
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
          <button onClick={handleFilter}>Filter Entries</button>
        </div>
      )}

      {/*render JournalEntryForm.js*/}
      <JournalEntryForm
        onSubmit={(entry) =>
          currentEntry
            ? handleEdit(currentEntry._id, entry)
            : handleCreate(entry)
        }
        currentEntry={currentEntry}
        clearCurrentEntry={() => setCurrentEntry(null)}
      />

      {/*render Journal Entries*/}
      <div>
        <h3>Journal Stats: </h3>
        <p>
          Total Entries: {viewAll ? journals.length : filteredJournals.length}
        </p>
        {/* Display Entries - count per month*/}
        <div>
          <p>Entries Per Month:</p>
          <ul>
            {Object.entries(entriesPerMonth).map(([monthYear, count]) => (
              <li key={monthYear}>
                {monthYear}: {count} {count === 1 ? "entry" : "entries"}
              </li>
            ))}
          </ul>
        </div>

        <h2>*:･ﾟ✧*:･ﾟ✧Journal Entries*:･ﾟ✧*:･ﾟ✧</h2>

        {(viewAll ? journals : filteredJournals).map((journal) => (
          <div key={journal._id}>
            <h3>{journal.title}</h3>
            <small>
              Created on: {new Date(journal.createdAt).toLocaleString()}
            </small>

            <p>{journal.content}</p>
            <br />
            {/*edit and delete button*/}
            <button onClick={() => setCurrentEntry(journal)}>Edit</button>
            <button onClick={() => handleDelete(journal._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JournalDashboard;
