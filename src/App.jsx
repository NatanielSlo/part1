import { useState, useEffect } from "react";
import axios from "axios";
import personService from "./services/persons";

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }
  const notificationStyle = {
    color: "red",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
  };

  return <div style={notificationStyle}>{message}</div>;
};

const SearchFilter = ({ filter, handleFilterChange }) => {
  return (
    <form>
      Filter: <input value={filter} onChange={handleFilterChange} />
    </form>
  );
};

const NewPersonForm = ({
  addPerson,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange,
}) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const PersonsDisplay = ({ personsToShow, deletePerson }) => {
  return (
    <ul>
      {personsToShow.map((name) => (
        <Person key={name.id} name={name} deletePerson={deletePerson} />
      ))}
    </ul>
  );
};

const Person = ({ name, deletePerson }) => {
  return (
    <li key={name.name}>
      {name.name} {name.number}
      <button onClick={() => deletePerson(name)}>delete</button>
    </li>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [notification, setNotificationMessage] = useState(null);

  const hook = () => {
    personService.getAll().then((response) => {
      setPersons(response.data);
    });
  };

  useEffect(hook, []);

  const addPerson = (event) => {
    event.preventDefault();

    if (persons.some((e) => e.name === newName)) {
      if (
        window.confirm(
          newName +
            " is already added to the phonebook, replace the old number with a new one?"
        )
      ) {
        const personObject = persons.find((person) => person.name === newName);
        const updatedPerson = { ...personObject, number: newNumber };
        personService
          .update(personObject.id, updatedPerson)
          .then((response) => {
            setPersons(
              persons.map((person) =>
                person.id === personObject.id ? response.data : person
              )
            );
            setNotificationMessage("Updated the number of" + personObject.name);
            setTimeout(() => {
              setNotificationMessage(null);
            }, 5000);
            setNewName("");
            setNewNumber("");
          })
          .catch((error) => {
            setNotificationMessage(
              personObject.name + " was already deleted from the server"
            );
            setTimeout(() => {
              setNotificationMessage(null);
            }, 5000);
          });
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
      };
      personService.create(personObject).then((response) => {
        setNotificationMessage("Added " + personObject.name);
        setTimeout(() => {
          setNotificationMessage(null);
        }, 5000);
        setPersons(persons.concat(response.data));
        setNewName("");
        setNewNumber("");
      });
    }
  };

  const deletePerson = (personObject) => {
    if (window.confirm(`Delete ${personObject.name}?`)) {
      personService
        .remove(personObject.id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== personObject.id));
          setNotificationMessage("Deleted " + personObject.name);
          setTimeout(() => {
            setNotificationMessage(null);
          }, 5000);
        })
        .catch((error) => {
          console.error("Error deleting person:", error);
        });
    }
  };

  const handleNameChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    console.log(event.target.value);
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    console.log(event.target.value);
    setFilter(event.target.value);
  };

  const personsToShow = filter
    ? persons.filter((person) => person.name.toLowerCase().includes(filter))
    : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} />
      <SearchFilter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>Add someone: </h2>
      <NewPersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <PersonsDisplay
        personsToShow={personsToShow}
        deletePerson={deletePerson}
      />
    </div>
  );
};

export default App;
