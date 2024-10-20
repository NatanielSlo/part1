import { useState } from 'react'

const SearchFilter = ({filter, handleFilterChange}) => {
  return (
    <form>
        Filter: <input value={filter} onChange={handleFilterChange}/>
      </form>
  );
}

const NewPersonForm = ({addPerson,newName,handleNameChange,newNumber,handleNumberChange}) => {
  return(
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>number: <input value={newNumber} onChange={handleNumberChange}/></div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

  );
}

const PersonsDisplay = ({personsToShow}) => {
  return(
    <ul>
      {personsToShow.map(name => 
        <li key={name.name}>{name.name} {name.number}</li>
      )}
    </ul>

  );
}
 
const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '607363842' }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const addPerson = (event) => {
    event.preventDefault()

    if (persons.some(e => e.name === newName)) {
      alert(newName +  'is already added')
    }
    else{
      const personObject = {
        name: newName,
        number: newNumber
      }
      setPersons(persons.concat(personObject))
      setNewName('')
      setNewNumber('')
    }
   
  }
  
  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  const personsToShow = filter? persons.filter(person => person.name.toLowerCase().includes(filter) ) : persons


  return (
    <div>
      <h2>Phonebook</h2>
      <SearchFilter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>Add someone: </h2>
      <NewPersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <PersonsDisplay personsToShow={personsToShow} />
    </div>
  )
}

export default App