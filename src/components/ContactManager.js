import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { Box, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

export const ContactManager = () => {
    //getting the url from .env
    // console.log(process.env.REACT_APP_API_URL)
    const API_URL = process.env.REACT_APP_API_URL
    //states for the form
    const [contacts, setContacts] = useState([]);
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [gender, setGender] = useState('');
    const [update,setUpdate] = useState(false)

    //function for getting data
    const getData = async () => {
        try {
            const response = await axios.get(API_URL)
            // console.log(response.data)
            setContacts(response.data)
        }
        catch (err) {
            console.log(err)
        }
    }
    // console.log(contacts)

    //calling gerdata func insinde empty array useeffect
    useEffect(() => {
        getData()
    }, [])

    //function to add new contact
    const addContact = async (contact) => {
        try {
            await axios.post(API_URL, contact)
        }
        catch (err) {
            console.log(err)
        }
        getData()
        setName("")
        setPhoneNumber("")
        setGender("")
        setUpdate(false)
    }
    //submit function for adding contact
    const handleSubmit = () => {
        const newContact = {
            username: name,
            phone_number: phoneNumber,
            gender: gender
        }
        console.log(newContact)
        addContact(newContact)
    }
    //deletting contact
    const handleDelete = async (id) => {
        try {
            await axios.delete(API_URL + id)
        }
        catch (err) {
            console.log(err)
        }
        getData()
    }
    // function to edit
    const editContact = async (id) => {
        try {
            const response = await axios.get(API_URL + id)
            // console.log(response.data)
            setName(response.data.username)
            setPhoneNumber(response.data.phone_number)
            setGender(response.data.gender)
            handleDelete(id)
            setUpdate(true)
        }
        catch (err) {
            console.log(err)
        }
    }

    return (
        <Box sx={{ display:'flex', flexDirection:"column", justifyContent:"center",alignItems:"center",}}>
            <Box sx={{maxWidth:800,m:3}}>
                <form  style={{display:'flex', flexDirection:"row", justifyContent:"center",alignItems:"center",}} onSubmit={() => handleSubmit()}>
                    <TextField required label="Name" value={name} onChange={(e) => setName(e.target.value)} />
                    <TextField sx={{ml:1}} required label="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                    <FormControl sx={{ minWidth: 120, ml:1 }}>
                        <InputLabel >Gender</InputLabel>
                        <Select required value={gender} onChange={(e) => setGender(e.target.value)} label="Gender">
                            <MenuItem value={"M"}>M</MenuItem>
                            <MenuItem value={"F"}>F</MenuItem>
                            <MenuItem value={"O"}>O</MenuItem>
                        </Select>
                    </FormControl>
                    {!update ?
                    <Button sx={{ml:1}} type="submit" variant="contained" color="primary">Add Contact</Button>
                    :
                    <Button sx={{ml:1}} type="submit" variant="contained" color="primary">Update</Button>
                     }

                </form>
            </Box>
            <Box sx={{maxWidth:800,  minWidth:500}}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Number</TableCell>
                                <TableCell>Username</TableCell>
                                <TableCell>Phone Number</TableCell>
                                <TableCell>Gender</TableCell>
                                <TableCell>Delete</TableCell>
                                <TableCell>Edit</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {contacts.map((contact, index) => (
                                <TableRow key={contact.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{contact.username}</TableCell>
                                    <TableCell>{contact.phone_number}</TableCell>
                                    <TableCell>{contact.gender}</TableCell>
                                    <TableCell>
                                        <Button  onClick={() => handleDelete(contact.id)} variant="contained" color="secondary">Delete</Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button onClick={() => editContact(contact.id)} variant="contained" color="primary">Edit</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    )
}