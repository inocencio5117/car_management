<template>
    <section class="cars-section">
        <ul class="cars-list">
            <li class="car-item" v-for="(car, index) in cars" :key="`carslist-${fetchKey}-${index}`">
                <div class="first-block">
                    <span>Model: {{ car?.model }}</span>
                    <span>Year: {{ car?.year }}</span>
                    <span>Status: {{ car?.status }}</span>
                </div>
                <div class="second-block">
                    <span class="price">
                        <b>{{ currencyformatter.format(Number(car?.price)) }}</b>
                    </span>
                    <button>
                        Comprar
                    </button>
                </div>
            </li>
        </ul>
    </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, computed, ref } from 'vue';
import { useQuery } from 'vue-query';
import axios from 'axios';
import emitter from '../plugins/emitter';

onBeforeUnmount(() => {
    emitter.off('search')
})

const searchValue = ref<string>('');
const fetchKey = ref<number>(0);
emitter.on('search', (e) => {
    searchValue.value = e
    fetchKey.value++
    console.log('search received')
})

type Car = {
    id: number;
    model: string;
    year: number;
    price: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

const carsFetch = async (): Promise<Car[]> => {
    if (searchValue.value !== '') return (await axios.get(`http://localhost:3000/car/${searchValue.value}`)).data
    return (await axios.get('http://localhost:3000/car')).data
}

const { data } = useQuery('car', carsFetch);

const cars = computed(() => {
    console.log(Array.isArray(data))
    return Array.isArray(data.value) ? data.value : [data.value]
})

const currencyformatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
})
</script>

<style lang="scss">
@mixin block-style($justify-content) {
    display: flex;
    flex-direction: column;
    justify-content: $justify-content;
    width: 50%;
}

.cars-section {
    margin: 5rem;

    .cars-list {
        display: flex;
        flex-direction: column;
        align-items: center;

        .car-item {
            display: flex;
            justify-content: space-between;

            margin: 1rem 0;
            padding: 1rem;

            width: 38rem;
            height: 10rem;
            border: 1px solid var(--text-color);
            border-radius: .6rem;
            color: var(--text-color);

            .first-block {
                @include block-style(space-between);
            }

            .second-block {
                @include block-style(space-evenly);
                align-items: center;

                .price b {
                    font-size: 1.5rem;
                }

                button {
                    background-color: var(--text-highlighted-color);
                    width: 8rem;
                    padding: .5rem 0;
                    border-radius: .6rem;
                    border: none;
                }
            }
        }
    }
}
</style>