<template>
  <h2 class="title"> Aqui conseguirá ver os videos de demonstração para perceber melhor os conceitos ou o uso da plataforma. <br/>
    Os vídeos estão todos disponíveis na pasta /public/videos/demos/
  </h2>
  <b-tabs class="tabs" v-model="activeTab">
    <b-tab class="presentation" title="Apresentação">
      <div>
      <video ref="presentationVideo" class="video" type="video" aspect="4by3" controls>
        <source :src="'/public/videos/demos/' + videoPresentationUrl" type="video/mp4">
      </video >
    </div>
    </b-tab>
    <b-tab title="Setup e Uso da Plataforma">
      <b-card class="demoTabs" no-body>
        <b-tabs v-model="activeTopicTab" pills card vertical nav-wrapper-class="w-15" content-class="col">
          <b-tab 
            v-for="(videoTopic, index) in useCaseTopics" :key="index"
            :title="videoTopic.topic"
          >
            <div>
            <p  class="content-text" v-if="videoTopic.topicText"> {{ videoTopic.topicText }} </p>
            <video :ref="'video-' + index" v-if="videoTopic.videoUrl" class="video" type="video" aspect="4by3" controls>
              <source :src="'/public/videos/demos/' + videoTopic.videoUrl" type="video/mp4">
            </video >
          </div>
          </b-tab>
        </b-tabs>
      </b-card>
    </b-tab>
    <b-tab title="Glossário">
      <b-card class="demoTabs" no-body>
        <b-tabs pills card vertical nav-wrapper-class="w-20" content-class="col">
          <b-tab 
            v-for="(videoTopic, index) in glossary" :key="index"
            :title="videoTopic.topic"
          >
            <p class="content-text" :innerHTML="videoTopic.content"></p>
          </b-tab>
        </b-tabs>
      </b-card>
    </b-tab>
  </b-tabs>
</template>

<script lang="ts">

import { defineComponent } from "vue";


export default defineComponent({
  components: { 
  },
  data() {
    return {
      videoElements: [] as HTMLVideoElement[],
      activeTab: 0,
      activeTopicTab: 0,
      videoPresentationUrl: "Presentation.mp4",
      glossary: [
        { 
          topic: "Programa de treino",
          content: `
          Um programa de treino é o programa a executar por um conjunto de participantes ao longo do tempo. O programa é constituído por várias sessões, módulos modelo e recursos generalistas.
          <br/><br/>
          Por exemplo, se quiséssemos ter uma intervenção sobre bullying, podíamos ter sessões em que cada tipo de bullying seria explorado em detalhe.
          `,
        },
        { 
          topic: "Sessão",
          content: `
          Uma sessão corresponde a um momento de participação, em que um participante executa um conjunto de passos até acabar a sessão e sair. As sessões dentro de um programa de intervenção não são obrigatórias e uma sessão é constituída por um conjunto de passos ordenados, recursos da sessão, e notas de sincronização.
          <br/><br/>
Por exemplo, para um programa de intervenção sobre bullying podíamos ter uma sessão dedicada a cyberbullying.

          `,
        },
        { 
          topic: "Passos",
          content: `
          Um passo corresponde a uma página que permite realizar um conjunto de tarefas, e é um elemento de uma sessão. Os passos são sequenciados, e formados por 1 ou vários módulos.
<br/><br/>
Um passo pode ter algumas características próprias, como ser um passo de sincronização, em que um passo que fica bloqueado até o gestor da sessão o permitir para todos os utilizadores.
<br/><br/>
Um passo pode ser também opcional, quando têm um módulo com submissão de conteúdo, pode ser um passo que mostra o seu conteúdo em 2 colunas em paralelo, e pode ser um passo como uma aba lateral de recursos, de sessão e/ou generalistas.
<br/><br/>
Por exemplo, um passo dentro de uma sessão de cyberbullying pode ser uma página com um quiz com perguntas sobre o tópico e/ou com um fórum onde pode discutir as perguntas com um grupo de utilizadores.

          `,
        },
        { 
          topic: "Módulos",
          content: `
          Os módulos são um elemento com conteúdo a ver ou realizar, e são elementos de passos. Os módulos são sequenciados e são separados pelos seus vários tipos. Os módulos podem ter submissão de conteúdo, cujos resultados serão guardados depois de um utilizador submeter o passo no qual está inserido. Quando adicionamos um módulo com submissão de conteúdo a um passo, passa a ser impossível tornar este último num passo de sincronização. Contudo, quando existe submissão de conteúdo o passo pode ser opcional.
<br/><br/>
Por exemplo, um módulo pode ser um quiz com perguntas de verdadeiro ou falso.

          `,
        },
        { 
          topic: "Grupos Escolares",
          content: `
            Os grupos escolares definem um agrupamento no qual os utilizadores são inseridos. 
            <br/> <br/> 
            As atividades são feitas ao nivel do grupo escolar.
          `,
        },
        { 
          topic: "Atividades",
          content: `
            Uma atividade é a realização de um programa de treino feita por um grupo escolar, ou seja, é uma associação de um grupo escolar a um programa de treino para este poder ser realizado.
          `,
        },
        { 
          topic: "Sessão ativa",
          content: `
            Uma sessão ativa é a realização de uma sessão. Esta sessão corresponde à sessão do programa de treino associado à atividade.
          `,
        },
        { 
          topic: "Grupo de Fórum",
          content: `
            Um grupo de fórum é um grupo dentro de uma sessão átiva composto por um número de utilizadores, usado para qualquer atividade de grupo. Como por exemplo o fórum
            
            <br/>
            <br/>
            Um grupo de fórum global é um grupo de fórum associado a uma atividade usado como default quando uma sessão é iniciada. É especialmente útil se for preciso que os grupos sejam os mesmos para sessões diferentes.
          `,
        },
      ],
      useCaseTopics: [
        { 
          topic: "Introdução",
          topicText: "Nestes tutoriais vai poder aprender a fazer um setup da base do projeto e a gerir as várias secções de gestão. Os conceitos não são explicados nestes vídeos, estando a sua explicação no glossário.",
        },
        { 
          topic: "Setup Base",
          videoUrl: "BaseSetup.mp4",
        },
        { 
          topic: "Programa de treino",
          videoUrl: "TrainingProgram.mp4",
        },
        { 
          topic: "Utilizadores",
          videoUrl: "Users.mp4",
        },
        { 
          topic: "Atividades",
          videoUrl: "Activities.mp4",
        },
      ],
    }
  },
  watch: {
    activeTab() {
      for(let videoElement of this.videoElements) {
        videoElement.pause();
      }
    },
    activeTopicTab() {
      for(let videoElement of this.videoElements) {
        videoElement.pause();
      }
    }
  },
  mounted() {
    let presentationVideo = this.$refs['presentationVideo'] as HTMLVideoElement;
    this.videoElements.push(presentationVideo);
    for(let i = 0; i < this.useCaseTopics.length; i++) {
      if(this.useCaseTopics[i].videoUrl) {
        let topicVideo = this.$refs['video-' + i] as any;
        let element = topicVideo[0] as HTMLVideoElement;

        this.videoElements.push(element);
      }
    }

    let videoElementList = this.videoElements;
    for(let videoElement of videoElementList) {
      videoElement.addEventListener('play', () => {
        for(let element of videoElementList) {
          if(element != videoElement) {
            element.pause();
          }
        }
      });
    }
  },
});
</script>

<style scoped>
.descriptive-user-container {
  margin-bottom: 50px;
}
@media only screen and (min-width: 992px) {
  .descriptive-user-container .descriptive-user-row:last-child {
    margin-bottom: 0px;
  }
}

.video {
  max-width: 80%;
  max-height: 80%;
}

.video {
  max-height: 65vh;
}

.presentation {
  max-height: 80%;
}

.demoTabs .content-text {
  margin-left: auto;
  margin-right: auto;
  padding: 20px;
}

.title {
  max-height: 30vh;
}

</style>
<style>

.demoTabs .card-header-tabs .nav-link.active {
  background-color: var(--bs-nav-pills-link-active-bg) !important;
}
.demoTabs .tab-content .active {
  padding: 0px;
}

.demoTabs .card-header .nav-item button {
  text-align: left;
}
</style>