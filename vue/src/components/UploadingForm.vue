<script lang="ts" setup>
import { onMounted, reactive } from 'vue';
import Axios from 'axios';

const apiBase = "http://localhost:9000";
const axios = Axios.create({
  baseURL: apiBase
  // port: 9000
});

onMounted(async () => {
  // clearState()
  await fetchFiles()
})

const initState = reactive({
  multipleField: [],
  simpleField: [],
});
let state: any;
const clearState = () => {
  state = initState;
};

clearState();



const uploadFiles = async (fieldName, files) => {
  const formData = new FormData();
  Object.values(files).forEach((file: Blob) => {
    formData.append('files', file);
  })
  const headers = {
    'Content-Type': 'multipart/form-data'
  };
  await axios.post(`${fieldName}/file`, formData, { headers });
  await fetchFiles();
}

const fetch = async (route: string, fieldName: string) => {
  const { data } = await axios.get(route);
  state[fieldName] = data;
}

const fetchFiles = async () => {
  fetch('/multipleField/files', 'multipleField');
  fetch('/simpleField/files', 'simpleField');
}

const deleteFile = async (id: number) => {
  await axios.delete(`/file/${id}`);
  await fetchFiles();
}

</script>

<template>
  <div class="d-flex">
    <section class="shadow m-5">
      <div class="mb-2" v-for="{ id, link, name } in state.multipleField">
        <a class="btn btn-primary" :href=link :download=name><span>{{ name }}</span></a>
        <a @click="deleteFile(id)" class="mx-2 btn btn-danger">X</a>
      </div>
      <div class="d-flex">
        <div>
          <h2>Multiple field</h2>
          <label for="multipleField" class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-paperclip"
              viewBox="0 0 16 16">
              <path
                d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0V3z" />
            </svg>
          </label>
        </div>
      </div>
      <input @change="uploadFiles('multipleField', $event.target?.files)" type="file" id="multipleField"
        name="multipleField" multiple hidden>
    </section>

    <section class="shadow">
      <div v-if="state.simpleField" class="mb-2">
        <a class="btn btn-primary" :href=state.simpleField.link :download=state.simpleField.name><span>{{
            state.simpleField.name
        }}</span></a>
        <a @click="deleteFile(state.simpleField.id)" class="mx-2 btn btn-danger">X</a>
      </div>
      <div class="d-flex">
        <div>
          <h2>Non-multiple field</h2>
          <label for="simpleField" class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-paperclip"
              viewBox="0 0 16 16">
              <path
                d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0V3z" />
            </svg>
          </label>
        </div>
      </div>
      <input @change="uploadFiles('simpleField', $event.target?.files)" type="file" id="simpleField" name="simleField"
        hidden>
    </section>
  </div>

</template>

<style>
section {
  flex: 50%;
}
</style>