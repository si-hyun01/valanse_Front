import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const EditQuizDialog = ({ open, onClose, onSubmit, initialValues }) => {
    const [formData, setFormData] = useState(initialValues);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        onSubmit(formData);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>퀴즈 수정</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label="제목"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                />
                {/* 필요한 다른 입력 필드들 추가 */}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>취소</Button>
                <Button onClick={handleSubmit}>수정</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditQuizDialog;
