import * as React from 'react';
import axios from 'axios'
import './App.css'


const api = axios.create(
  {
    baseURL: 'http://localhost:8000'
  }
);

//MAIN STATE HANDLER REDUCER FUNCTION
const operationReducer = (state,action) =>
{
  switch (action.type)
  {
    case 'OP_START':
    {
      return {...state, message:'Processing...'};
    }
    case 'CREATE_OP':
    {
      return {...state, isCreate: true, isUpdate: false, isGet: false, isDelete: false, isList: false, isError: false, message:'Create Key Value Operation', kvList: []};
    }
    case 'UPDATE_OP':
    {
      return {...state, isCreate: false, isUpdate: true, isGet: false, isDelete: false, isList: false, isError: false, message: 'Key Value Update Operation', kvList: []};
    }
    case 'GET_OP':
    {
      return {...state,  isCreate: false, isUpdate: false, isGet: true, isDelete: false, isList: false, isError: false, value: '', message: 'Key Value Get Operation', kvList: []};
    }
    case 'DELETE_OP':
    {
      return {...state,  isCreate: false, isUpdate: false, isGet: false, isDelete: true, isList: false, isError: false, value: '',  message: 'Key Value Delete Operation',kvList: []};
    }
    case 'LIST_OP':
    {
      return {...state,  isCreate: false, isUpdate: false, isGet: false, isDelete: false, isList: true, isError: false, message: 'Key Value Listing Operation', kvList: []};
    }
    case 'LIST_FETCH':
    {
      return {...state, message: 'Total Key Value Pairs: ' + action.payload.length, kvList: action.payload};
    }
    case 'OPERATION_FAILURE':
    {
      return {...state, isError: true, key: '', value: '',  message: action.payload};
    }
    case 'SET_KEY':
    {
      return {...state, key: action.payload}
    }
    case 'SET_VALUE':
    {
      return {...state, value: action.payload}
    }
    case 'SET_MESSAGE':
    {
      return {...state, message: action.payload}
    }
    default:
      //unhandled case
      throw new Error();
  }
};

function App() {

  //MAIN STATE OBJECT
  const [operation,dispatchOperations] = React.useReducer(operationReducer,{isCreate: false, isUpdate: false, isGet: false, isDelete: false, isList: false, isError: false, key: '', value: '', message: '', kvList: []});
  //Booleans tell which operation to perform or in which stage of operation is in progress


  //Key Setter
  const handleKeyInput = (event) =>
  {
    dispatchOperations({type: 'SET_KEY', payload: event.target.value});
  };

  //Value Setter
  const handleValueInput = (event) =>
  {
    dispatchOperations({type: 'SET_VALUE', payload: event.target.value});
  };


  //CREATE KEY,Value
  //CREATE FORM RENDERER
  const createKVOP = () =>
  {
    dispatchOperations({type: 'CREATE_OP'})
  }
  //CREATE OP PERFORMER
  const handleCreateKV = async (event) =>
  {
    event.preventDefault();
    try
    {
      dispatchOperations({type: 'OP_START'})
      const response = await api.put('/createItem/', {key: operation.key, value: operation.value})
      dispatchOperations({type: 'SET_MESSAGE', payload: response.data.message})

    } catch (error){
      dispatchOperations({type: 'OPERATION_FAILURE', payload: error.message})
    }
  }

  //UPDATE KEY-VALUE
  //UPDATE FORM RENDERER
  const updateKVOP = () =>
  {
    dispatchOperations({type: 'UPDATE_OP'})
  }
  //UPDATE OP PERFORMER
  const handleUpdateKV = async (event) =>
  {
    event.preventDefault();
    try
    {
      dispatchOperations({type: 'OP_START'})
      const response = await api.put('/updateItem/', {key: operation.key, value: operation.value})
      dispatchOperations({type: 'SET_MESSAGE', payload: response.data.message})

    } catch (error){
      dispatchOperations({type: 'OPERATION_FAILURE', payload: error.message})
    }
  }

  //FETCH KV LIST RENDERER AND PERFORMER
  const handleAndFetchKVList = async () =>
  {
    try 
    {
      dispatchOperations({type: 'LIST_OP'})
      dispatchOperations({type: 'OP_START'})
      const response = await api.get('/list/');
      dispatchOperations({type: 'LIST_FETCH', payload: response.data})

    } catch (error){
      dispatchOperations({type: 'OPERATION_FAILURE', payload: error.message})
    }
  }

  //GET KV
  //GET FORM RENDERER
  const getKVOP = () =>
  {
    dispatchOperations({type: 'GET_OP'})
  }
  //GET OP PERFORMER
  const handleGetKV = async (event) =>
  {
    event.preventDefault();
    try
    {
      dispatchOperations({type: 'OP_START'})
      const response = await api.get('/getItem/',{
        params: { key: operation.key },})
      dispatchOperations({type: 'SET_MESSAGE', payload: response.data.message})
      dispatchOperations({type: 'SET_VALUE', payload: response.data.value})

    } catch (error){
      dispatchOperations({type: 'OPERATION_FAILURE', payload: error.message})
    }
  }

  //DELETE KV
  //DELETE FORM RENDERER
  const deleteKVOP = () =>
  {
    dispatchOperations({type: 'DELETE_OP'})
  }
  //DELETE OP PERFORMER
  const handleDeleteKV = async (event) =>
  {
    event.preventDefault();
    try
    {
      dispatchOperations({type: 'OP_START'})
      const response = await api.delete('/deleteItem/',{
        params: { key: operation.key },})
      dispatchOperations({type: 'SET_MESSAGE', payload: response.data.message})

    } catch (error){
      dispatchOperations({type: 'OPERATION_FAILURE', payload: error.message})
    }
  }


  return (
    <div>
      <h1>Welcome To The Key Value Store</h1>

      <OperationButtons onCreateClick = {createKVOP} onUpdateClick = {updateKVOP} 
      onGetClick = {getKVOP} onDeleteClick = {deleteKVOP} onListClick = {handleAndFetchKVList}/>

      <strong>{operation.message}</strong>

      {operation.isCreate && <KeyValueForm keyTerm = {operation.key} valueTerm = {operation.value} onKeyInputChange = {handleKeyInput} onValueInputChange = {handleValueInput} onSubmit = {handleCreateKV} />}

      {operation.isUpdate && <KeyValueForm keyTerm = {operation.key} valueTerm = {operation.value} onKeyInputChange = {handleKeyInput} onValueInputChange = {handleValueInput} onSubmit = {handleUpdateKV} />}

      {operation.isGet && <KeyGetValueForm keyTerm = {operation.key} valueTerm = {operation.value} onKeyInputChange = {handleKeyInput} onSubmit = {handleGetKV}/>}

      {operation.isDelete && <KeyForm keyTerm = {operation.key} onKeyInputChange = {handleKeyInput} onSubmit = {handleDeleteKV}/>}

      {operation.isList && <List list = {operation.kvList} />}

    </div>
  );

}

//OPERATIONS SWITCH COMPONENT
const OperationButtons = ({onCreateClick, onUpdateClick, onGetClick, onDeleteClick, onListClick}) =>
{
  return (
    <div>
      <button type="button" onClick={() => onCreateClick()}>Create</button>
      <button type="button" onClick={() => onUpdateClick()}>Update</button>
      <button type="button" onClick={() => onGetClick()}>Get</button>
      <button type="button" onClick={() => onDeleteClick()}>Delete</button>
      <button type="button" onClick={() => onListClick()}>List</button>
    </div>
  );
}

const List = ({list}) =>
{
  return (
  <ul>
  {
    list.map((itm) =>{
      return (<Item key={itm.key} item={itm} />);
    })
  }
  </ul>
  );
}

const Item = ({item}) =>
{
  return(
  <li>
    <span> <strong>Key: </strong>{item.key} </span>
    <span><strong>Value: </strong>{item.value} </span>
  </li>);
}

//SUBCOMPONENT FOR FORMS
const InputWithLabel =({id, type ='text', value, isFocused, onInputChange, children}) =>
{

  const inputRef =React.useRef();

  React.useEffect(() => {
    if(isFocused && inputRef.current)
    {
      inputRef.current.focus();
    }
  },[isFocused]);

  return(
    <React.Fragment>
        <label htmlFor={id}>{children} </label>
        &nbsp;
        <input ref={inputRef} id={id} type={type} value={value} onChange={onInputChange}/>
    </React.Fragment>
  )
}

//FORM CONSISTING OF KEY AND VALUE INPUT FIELDS
const KeyValueForm = ({keyTerm, valueTerm, onKeyInputChange, onValueInputChange, onSubmit}) =>
{
  return (
    <form onSubmit={onSubmit}>

      <InputWithLabel  id="Key" value={keyTerm} isFocused onInputChange={onKeyInputChange}>

      <strong>Key:</strong>
      </InputWithLabel>

      <InputWithLabel  id="Value" value={valueTerm} isFocused onInputChange={onValueInputChange}>

      <strong>Value:</strong>
      </InputWithLabel>

      <button
        type="submit"
        disabled={!keyTerm || !valueTerm}
      >
        Submit
      </button>

    </form>
  )
}

//FORM CONSISTING ONLY OF KEY INPUT FIELD
const KeyForm = ({keyTerm, onKeyInputChange, onSubmit}) =>
  {
    return (
      <form onSubmit={onSubmit}>
  
        <InputWithLabel  id="Key" value={keyTerm} isFocused onInputChange={onKeyInputChange}>
  
        <strong>Key:</strong>
        </InputWithLabel>
  
        <button
          type="submit"
          disabled={!keyTerm}
        >
          Submit
        </button>
  
      </form>
    )
  }

  //FORM CONSISTING OF KEY INPUT FIELD AND VALUE OUTPUT FIELD
  const KeyGetValueForm = ({keyTerm, valueTerm, onKeyInputChange, onSubmit}) =>
  {
    return (
      <form onSubmit={onSubmit}>
  
        <InputWithLabel  id="Key" value={keyTerm} isFocused onInputChange={onKeyInputChange}>
  
        <strong>Key:</strong>
        </InputWithLabel>
  
        <button
          type="submit"
          disabled={!keyTerm}
        >
          Submit
        </button>

        <strong> Value: {valueTerm}</strong>
  
      </form>
    )
  }

export default App
