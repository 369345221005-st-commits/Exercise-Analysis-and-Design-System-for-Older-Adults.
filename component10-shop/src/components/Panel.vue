<template>
  <section class="panel">
    <header class="panel-head">
      <slot name="header">หัวข้อเริ่มต้น</slot>
    </header>

    <div class="panel-body">
      <slot></slot>
    </div>

    <footer class="panel-foot">
      <slot name="footer"></slot>
    </footer>
  </section>
</template>

<style scoped>
.panel { border: 1px solid #E7E2D6; border-radius: 14px; overflow: hidden; margin: 16px 0; }
.panel-head { background: #2c8edf; color: #fff; padding: 12px 16px; font-weight: 600; }
.panel-body { padding: 16px; }
.panel-foot { border-top: 1px solid #eeeeee; padding: 12px 16px; background: #FBFAF6; }
</style>