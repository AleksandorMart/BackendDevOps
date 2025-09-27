const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;
const FILE_PATH = path.join(__dirname, 'data.txt');

// Middleware для разбора JSON
app.use(express.json());

// Обработчик POST-запроса
app.post('/save', async (req, res) => {
    try {
        const { data } = req.body;
        
        if (!data) {
            return res.status(400).json({ error: 'Данные отсутствуют' });
        }

        // Добавляем timestamp и записываем в файл
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

// Статическая раздача фронтенда
app.use(express.static(__dirname));

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});