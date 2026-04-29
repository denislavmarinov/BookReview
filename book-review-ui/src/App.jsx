import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

export default function App() {
  const [stats, setStats] = useState([]);
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});

  const api = "http://localhost:4000";

  const loadAll = async () => {
    const [s, b, a, g, u, r] = await Promise.all([
      axios.get(api + "/stats"),
      axios.get(api + "/books"),
      axios.get(api + "/authors"),
      axios.get(api + "/genres"),
      axios.get(api + "/users"),
      axios.get(api + "/reviews")
    ]);

    setStats(s.data);
    setBooks(b.data);
    setAuthors(a.data);
    setGenres(g.data);
    setUsers(u.data);
    setReviews(r.data);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const openModal = (type, item = null) => {
    setModal(type);
    setForm(item || {});
  };

  const save = async () => {
    const type = modal;

    if (form._id) {
      await axios.put(`${api}/${type}/${form._id}`, form);
    } else {
      await axios.post(`${api}/${type}`, form);
    }

    setModal(null);
    loadAll();
  };

  const remove = async (type, id) => {
    if (!window.confirm("Сигурен ли си?")) return;
    await axios.delete(`${api}/${type}/${id}`);
    loadAll();
  };

  const renderTable = (title, type, data, fields) => (
    <div className="section">
      <div className="section-header">
        <h2>{title}</h2>
        <button className="add-btn" onClick={() => openModal(type)}>+ Добави</button>
      </div>

      <table>
        <thead>
          <tr>
            {fields.map(f => <th key={f}>{f}</th>)}
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item._id}>
              {fields.map(f => <td key={f}>{item[f]}</td>)}
              <td>
                <button className="edit-btn" onClick={() => openModal(type, item)}>Редакция</button>
                <button className="delete-btn" onClick={() => remove(type, item._id)}>Изтрий</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container">
      <h1>📚 Book Review Platform</h1>

      <div className="stats">
        {stats.map(s => (
          <div className="stat-card" key={s.bookId}>
            <h3>{s.title}</h3>
            <p>Автор: {s.author}</p>
            <p>Жанр: {s.genre}</p>
            <p>⭐ Среден рейтинг: {s.averageRating.toFixed(2)}</p>
            <p>📝 Ревюта: {s.totalReviews}</p>
          </div>
        ))}
      </div>

      {renderTable("Книги", "books", books, ["title", "author", "genre", "publishedYear"])}
      {renderTable("Автори", "authors", authors, ["name", "country", "birthYear"])}
      {renderTable("Жанрове", "genres", genres, ["name", "description"])}
      {renderTable("Потребители", "users", users, ["name", "email"])}
      {renderTable("Ревюта", "reviews", reviews, ["user", "book", "rating", "comment"])}

      {modal && (
        <div className="modal-bg">
          <div className="modal">
            <h2>{form._id ? "Редакция" : "Добавяне"}</h2>

            {Object.keys(form).map(key => (
              key !== "_id" && (
                <input
                  key={key}
                  placeholder={key}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              )
            ))}

            <div className="modal-actions">
              <button className="save-btn" onClick={save}>Запази</button>
              <button className="cancel-btn" onClick={() => setModal(null)}>Отказ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
