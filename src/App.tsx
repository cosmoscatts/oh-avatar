// import styles from '~/styles/app.modules.less'

const App = defineComponent({
  setup() {
    return () => {
      return (
        <>h1</>
      //       <main class={styles.main}>
      //   <Container>
      //     <div class={styles['content-warpper']}>
      //       <div class={styles['content-view']}>
      //         <Header />

      //         <div class={styles.playground}>
      //           <div class="avatar-wrapper">
      //             <VueColorAvatar
      //               ref={colorAvatarRef}
      //               option="avatarOption"
      //               size={280}
      //               style={
      //                 transform: `rotateY(${flipped ? -180 : 0}deg)`,
      //               }
      //             />
      //           </div>

      //           <ActionBar @action="handleAction" />

      //           <div class="action-group">
      //             <button
      //               type="button"
      //               class="action-btn action-randomize"
      //               @click="handleGenerate"
      //             >
      //               {{ t('action.randomize') }}
      //             </button>

      //             <button
      //               type="button"
      //               class="action-btn action-download"
      //               :disabled="downloading"
      //               @click="handleDownload"
      //             >
      //               {{
      //                 downloading
      //                   ? `${t('action.downloading')}...`
      //                   : t('action.download')
      //               }}
      //             </button>

      //             <button
      //               type="button"
      //               class="action-btn action-multiple"
      //               @click="() => generateMultiple()"
      //             >
      //               {{ t('action.downloadMultiple') }}
      //             </button>
      //           </div>
      //         </div>

      //         <Footer />

      //         <CodeModal :visible="codeVisible" @close="codeVisible = false" />

      //         <DownloadModal
      //           :visible="downloadModalVisible"
      //           :image-url="imageDataURL"
      //           @close=";(downloadModalVisible = false), (imageDataURL = '')"
      //         />
      //       </div>

      //       <ConfettiCanvas />

      //       <div class="gradient-bg">
      //         <div class="gradient-top"></div>
      //         <div class="gradient-bottom"></div>
      //       </div>
      //     </div>
      //   </Container>

      //   <BatchDownloadModal
      //     :visible="avatarListVisible"
      //     :avatar-list="avatarList"
      //     @regenerate="generateMultiple"
      //     @close=";(avatarListVisible = false), (avatarList = [])"
      //   />

      //   <Sider>
      //     <Configurator />
      //   </Sider>
      // </main>
      )
    }
  },
})

export default App
