const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;
const FILE_PATH = path.join(__dirname, 'data.txt');

app.use(express.json());

// Существующий endpoint из версии 1.0
app.post('/save', async (req, res) => {
    try {
        const { data } = req.body;
        
        if (!data) {
            return res.status(400).json({ error: 'Данные отсутствуют' });
        }

        const timestamp = new Date().toISOString();
        const record = `[${timestamp}] ${data}\n`;
        
        await fs.appendFile(FILE_PATH, record);
        console.log('Данные сохранены:', record.trim());

        res.status(200).json({ message: 'Данные сохранены успешно' });
    } catch (error) {
        console.error('Ошибка:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

// Новый endpoint для версии 2.0
app.get('/data', async (req, res) => {
    try {
        // Пытаемся прочитать файл
        const content = await fs.readFile(FILE_PATH, 'utf-8');
        res.json({ 
            success: true, 
            content: content 
        });
    } catch (error) {
        if (error.code === 'ENOENT') {
            // Файл не существует
            res.json({ 
                success: true, 
                content: 'Файл еще не создан' 
            });
        } else {
            console.error('Ошибка чтения файла:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Ошибка чтения файла' 
            });
        }
    }
});

// Статическая раздача фронтенда
app.use(express.static(__dirname));

app.listen(PORT, () => {
    console.log(`Сервер версии 2.0 запущен на http://localhost:${PORT}`);
});