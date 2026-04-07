# Doca - Система управления документами

## Необходимые компоненты

### 1. Backend (ASP.NET Core 8.0+)
- .NET 10.0 SDK или выше
- MySQL Server (LocalDB или полная версия)
- Visual Studio 2022 / VS Code / Rider

### 2. Frontend (React + Vite)
- Node.js 18+ 
- npm или yarn
- Современный браузер (Chrome, Firefox, Edge)




## Запуск проекта

### Шаг 1: Клонирование репозитория
git clone <repository-url>
cd Doca

## Изменение конфигурации appsettings.json в папке Doca.Server
### Шаг 1: Создайте бьд и вставте туда этот скрипт sql


```sql
-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Хост: MySQL-8.4:3306
-- Время создания: Апр 07 2026 г., 15:07
-- Версия сервера: 8.4.7
-- Версия PHP: 8.5.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `DocaDb`
--

-- --------------------------------------------------------

--
-- Структура таблицы `Documents`
--

CREATE TABLE `Documents` (
  `Id` int NOT NULL,
  `Title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `CreatedById` int NOT NULL,
  `CreatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `TemplateId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `Documents`
--

INSERT INTO `Documents` (`Id`, `Title`, `CreatedById`, `CreatedAt`, `UpdatedAt`, `TemplateId`) VALUES
(1, 'Регламент доступа в серверную', 1, '2026-04-04 16:59:44', '2026-04-05 23:56:11', 4),
(3, 'Шаблон служебной записки', 1, '2026-04-04 16:59:44', '2026-04-05 16:47:02', 4);

-- --------------------------------------------------------

--
-- Структура таблицы `DocumentVersions`
--

CREATE TABLE `DocumentVersions` (
  `Id` int NOT NULL,
  `DocumentId` int NOT NULL,
  `VersionNumber` int NOT NULL,
  `Content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `ChangeDescription` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `CreatedById` int NOT NULL,
  `CreatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `DocumentVersions`
--

INSERT INTO `DocumentVersions` (`Id`, `DocumentId`, `VersionNumber`, `Content`, `ChangeDescription`, `CreatedById`, `CreatedAt`) VALUES
(1, 1, 1, '<h3>1. Общие положения</h3><p>Доступ разрешен только сотрудникам IT-отдела.</p>', 'Первоначальная версия', 1, '2026-04-04 16:59:44'),
(2, 1, 2, '<h3>1. Общие положения</h3><p>Доступ разрешен только сотрудникам IT-отдела и службы безопасности.</p><h3>2. Пожарная безопасность</h3><p>Запрещено хранение легковоспламеняющихся материалов.</p>', 'Добавлены сотрудники СБ и раздел по пожарной безопасности', 1, '2026-04-04 16:59:44'),
(4, 3, 1, '<p>Кому: [Должность, ФИО]<br>От: [Должность, ФИО]<br>Текст: [Суть запроса]</p>', 'Черновик шаблона', 1, '2026-04-04 16:59:44'),
(5, 3, 2, '<p><strong>СЛУЖЕБНАЯ ЗАПИСКА</strong></p><p>Кому: Руководителю отдела<br>От: [ФИО]<br>Тема: [Краткое описание]</p><p>Прошу рассмотреть возможность...</p>', 'Добавлена структура и заголовки', 1, '2026-04-04 16:59:44'),
(6, 3, 3, '<p><strong>СЛУЖЕБНАЯ ЗАПИСКА № ___</strong></p><p>Кому: Генеральному директору<br>От: Руководителя IT<br>Тема: Закупка серверного оборудования</p><hr><p>В связи с устареванием оборудования прошу согласовать закупку...</p>', 'Финальный утвержденный вариант', 2, '2026-04-04 16:59:44');

-- --------------------------------------------------------

--
-- Структура таблицы `Templates`
--

CREATE TABLE `Templates` (
  `Id` int NOT NULL,
  `Name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Без названия',
  `Description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `HeaderImage` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `FooterImage` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `IsPublic` tinyint(1) NOT NULL DEFAULT '0',
  `CreatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `CreatedById` int NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `Templates`
--

INSERT INTO `Templates` (`Id`, `Name`, `Description`, `Content`, `HeaderImage`, `FooterImage`, `IsPublic`, `CreatedAt`, `UpdatedAt`, `CreatedById`) VALUES
(4, 'Служебная записка', 'Стандартный шаблон служебной записки', '<h1 style=\"text-align:center\">СЛУЖЕБНАЯ ЗАПИСКА</h1>\r\n<p><strong>Кому:</strong> [Должность, ФИО]</p>\r\n<p><strong>От:</strong> [Ваша должность, ФИО]</p>\r\n<p><strong>Тема:</strong> [Краткое описание]</p>\r\n<hr>\r\n<p>[Текст обращения]</p>\r\n<p><br></p>\r\n<p><strong>Дата:</strong> [ДД.ММ.ГГГГ]</p>\r\n<p><strong>Подпись:</strong> ___________</p>', NULL, NULL, 1, '2026-04-05 16:47:02', '2026-04-05 16:47:02', 1),
(5, 'Приказ', 'Шаблон приказа по организации', '<h1 style=\"text-align:center\">ПРИКАЗ</h1>\r\n<p style=\"text-align:center\"><strong>№ _____</strong></p>\r\n<p style=\"text-align:center\"><strong>г. [Город]</strong></p>\r\n<p style=\"text-align:center\"><strong>[Дата]</strong></p>\r\n<hr>\r\n<h3>О [предмет приказа]</h3>\r\n<p>В связи с [причина]</p>\r\n<p><strong>ПРИКАЗЫВАЮ:</strong></p>\r\n<ol>\r\n  <li>[Пункт 1]</li>\r\n  <li>[Пункт 2]</li>\r\n</ol>\r\n<p><br></p>\r\n<p><strong>Руководитель:</strong> ___________ / [ФИО] /</p>', NULL, NULL, 1, '2026-04-05 16:47:02', '2026-04-05 16:47:02', 1),
(6, 'Отчёт о проделанной работе', 'Еженедельный отчёт сотрудника', '<h2 style=\"text-align:center\">ОТЧЁТ</h2>\r\n<p><strong>Период:</strong> [с ДД.ММ по ДД.ММ.ГГГГ]</p>\r\n<p><strong>Сотрудник:</strong> [ФИО, должность]</p>\r\n<hr>\r\n<h3>Выполненные задачи:</h3>\r\n<ul>\r\n  <li>[Задача 1] — [результат]</li>\r\n  <li>[Задача 2] — [результат]</li>\r\n</ul>\r\n<h3>Планы на следующий период:</h3>\r\n<ul>\r\n  <li>[План 1]</li>\r\n  <li>[План 2]</li>\r\n</ul>', NULL, NULL, 1, '2026-04-05 16:47:02', '2026-04-05 16:47:02', 1);

-- --------------------------------------------------------

--
-- Структура таблицы `Users`
--

CREATE TABLE `Users` (
  `Id` int NOT NULL,
  `Username` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `PasswordHash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `CreatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `Users`
--

INSERT INTO `Users` (`Id`, `Username`, `Email`, `PasswordHash`, `CreatedAt`) VALUES
(1, 'admin_it', 'admin@dept.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '2026-04-04 16:59:44'),
(2, 'manager_doc', 'manager@dept.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '2026-04-04 16:59:44'),
(3, 'sovesnovkp', 'sovesnovkirill@gmail.com', '$2a$11$xrB5AKU8aayyv3ACgBW9XusmynEbJ7N5HIN8I5aKKqox6JcoLN7fW', '2026-04-04 10:03:38');

-- --------------------------------------------------------

--
-- Структура таблицы `__EFMigrationsHistory`
--

CREATE TABLE `__EFMigrationsHistory` (
  `MigrationId` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ProductVersion` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `Documents`
--
ALTER TABLE `Documents`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_Documents_CreatedBy` (`CreatedById`),
  ADD KEY `IX_Documents_UpdatedAt` (`UpdatedAt` DESC),
  ADD KEY `IX_Documents_TemplateId` (`TemplateId`);

--
-- Индексы таблицы `DocumentVersions`
--
ALTER TABLE `DocumentVersions`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `IX_DocumentVersions_Document_Version` (`DocumentId`,`VersionNumber`),
  ADD KEY `IX_DocumentVersions_Document` (`DocumentId`),
  ADD KEY `IX_DocumentVersions_CreatedBy` (`CreatedById`);

--
-- Индексы таблицы `Templates`
--
ALTER TABLE `Templates`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_Templates_CreatedBy` (`CreatedById`),
  ADD KEY `IX_Templates_IsPublic` (`IsPublic`);

--
-- Индексы таблицы `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `IX_Users_Email` (`Email`),
  ADD UNIQUE KEY `IX_Users_Username` (`Username`);

--
-- Индексы таблицы `__EFMigrationsHistory`
--
ALTER TABLE `__EFMigrationsHistory`
  ADD PRIMARY KEY (`MigrationId`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `Documents`
--
ALTER TABLE `Documents`
  MODIFY `Id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT для таблицы `DocumentVersions`
--
ALTER TABLE `DocumentVersions`
  MODIFY `Id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT для таблицы `Templates`
--
ALTER TABLE `Templates`
  MODIFY `Id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT для таблицы `Users`
--
ALTER TABLE `Users`
  MODIFY `Id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `Documents`
--
ALTER TABLE `Documents`
  ADD CONSTRAINT `FK_Documents_Templates_TemplateId` FOREIGN KEY (`TemplateId`) REFERENCES `Templates` (`Id`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_Documents_Users_CreatedBy` FOREIGN KEY (`CreatedById`) REFERENCES `Users` (`Id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `DocumentVersions`
--
ALTER TABLE `DocumentVersions`
  ADD CONSTRAINT `FK_DocumentVersions_Documents` FOREIGN KEY (`DocumentId`) REFERENCES `Documents` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_DocumentVersions_Users` FOREIGN KEY (`CreatedById`) REFERENCES `Users` (`Id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

```



### Шаг 2: Измените строку подключения к серверу где лежит бд (MySql)

"ConnectionStrings": {
        "DefaultConnection": "Server=Название_сервера;Database=DocaDb;User=логин;Password=пароль;Port=3306;"
    },

### Шаг 3: Создайте и измените ключ для JWT 

 "Jwt": {
        "Key": "Ключ",
        "Issuer": "DocSystem",
        "Audience": "DocSystemClient",
        "ExpireHours": 24
    },




