import React, {useEffect, useMemo, useState} from 'react';
import axios from "axios";
import HotelsList from "../components/HotelsList";
import Sort from "../components/Sort";
import '../styles/Home.css'
import axiosInstance from "../utils/Axios";

const Home = () => {
    const [hotels, setHotels] = useState([])
    const [selectedSort, setSelectedSort] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    useEffect(() => {
        Fetching()
    }, [])

    async function Fetching() {
        let response = await axiosInstance.get('http://127.0.0.1:8000/hotels/')
        response.data.map((hotel) => {
            let price = hotel.price
            hotel.price = parseInt(price.match(/\d/g, ' ').join(''))
        })
        setHotels(response.data)
    }


    const sortedHotels = useMemo(() => {
        if (selectedSort) {
            if (selectedSort == 'rate' || selectedSort == 'price') {
                return [...hotels].sort((a, b) => (b[selectedSort] - a[selectedSort]))
            } else if (selectedSort == 'title' || selectedSort == 'address') {
                return [...hotels].sort((a, b) => a[selectedSort].localeCompare(b[selectedSort]))
            }
        }
        return hotels

    }, [selectedSort, hotels])

    const sortedAndSearchedHotels = useMemo(() => {
        return sortedHotels.filter(hotel => hotel.title.toLowerCase().includes(searchQuery))
    }, [searchQuery, sortedHotels])
    const sortHotels = (sort) => {
        setSelectedSort(sort)
    }
    return (
        <>
            <div className="filter-area">
                <input className="search-input" type="text" placeholder="Поиск..." value={searchQuery}
                       onChange={e => setSearchQuery(e.target.value)}/>
                <Sort value={selectedSort} onChange={sortHotels} defaultValue="Сортировка"
                      options={[
                          {value: 'title', name: 'По названию'},
                          {value: 'address', name: 'По адресу'},
                          {value: 'rate', name: 'По рейтингу'},
                          {value: 'price', name: 'По цене'},
                      ]}/>
            </div>
            <HotelsList hotels={sortedAndSearchedHotels}/>
        </>
    );
};

export default Home;