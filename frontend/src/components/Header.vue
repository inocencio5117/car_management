<template>
    <header class="header">
        <h2 class="title">
            Car Management System
        </h2>

        <div class="search">
            <input v-model="searchValue" @keypress.enter="handleSearch(searchValue)" type="text" class="search-bar">
            <v-icon @click="handleSearch(searchValue)" class="search-icon" name="io-search-sharp" />
        </div>

        <div class="login">
            <button class="theme-button" @click="mode = mode === 'dark' ? 'light' : 'dark'">
                <v-icon class="theme-icon" name="md-wbsunny-sharp" v-if="mode === 'dark'" />
                <v-icon class="theme-icon" name="wi-moon-waxing-crescent-4" v-else />
            </button>
            <v-icon class="login-icon" name="fa-user-alt" />
            <span>Entrar</span>
        </div>
    </header>
</template>

<script setup lang="ts">
import { useColorMode } from '@vueuse/core';
import { ref } from 'vue';
import emitter from '../plugins/emitter'

const mode = useColorMode()

const searchValue = ref<string>('');

const handleSearch = (value: string) => {
    emitter.emit('search', value)
}
</script>

<style lang="scss">
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    position: fixed;
    top: 0;

    width: 100vw;
    height: 5rem;
    padding: 0 6rem;
    margin-bottom: 2rem;
    background-color: var(--bkg-body);

    .search {
        border: 1px solid var(--text-color);
        border-radius: .6rem;
        padding: .5rem .35rem;

        .search-icon {
            fill: var(--text-color);
            cursor: pointer;
        }

        .search-bar {
            border: none;
            outline: none;
            margin-left: 10px;
            width: 20rem;
            background-color: var(--bkg-body);
            color: var(--text-color);
        }
    }

    .login {
        display: flex;
        align-items: center;
        gap: 1rem;

        border: 1px solid var(--text-color);
        border-radius: .6rem;
        padding: .7rem;
        color: var(--text-color);

        .theme-button {
            background-color: transparent;
            border: none;

            .theme-icon {
                fill: var(--text-color);
            }
        }

        .login-icon {
            fill: var(--text-color);
        }
    }
}
</style>