import React from 'react';
import { TextField, Button, Typography, Paper } from '@mui/material';

const SettingsPage = () => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <Paper className="w-full max-w-lg p-6 rounded-lg shadow-md">
                <Typography variant="h4" className="mb-4 text-center">
                    User Settings
                </Typography>
                <form className="space-y-4">
                    <div>
                        <TextField
                            fullWidth
                            label="Nama"
                            variant="outlined"
                            required
                        />
                    </div>
                    <div>
                        <TextField
                            fullWidth
                            label="Kelas"
                            variant="outlined"
                            required
                        />
                    </div>
                    <div>
                        <TextField
                            fullWidth
                            label="Nama Ibu"
                            variant="outlined"
                            required
                        />
                    </div>
                    <div>
                        <TextField
                            fullWidth
                            label="Nama Ayah"
                            variant="outlined"
                            required
                        />
                    </div>
                    <div>
                        <TextField
                            fullWidth
                            label="Nama Paman"
                            variant="outlined"
                            required
                        />
                    </div>
                    <div className="flex justify-between">
                        <Button variant="contained" color="primary" type="submit">
                            Save Changes
                        </Button>
                        <Button variant="outlined" color="secondary">
                            Cancel
                        </Button>
                    </div>
                </form>
            </Paper>
            <button className='border border-red-500 rounded-lg hover:shadow hover:shadow-red-500 hover:bg-red-500 hover:border-solid hover:border-red-500'>Delete Account</button>
        </div>
    );
};

export default SettingsPage;
