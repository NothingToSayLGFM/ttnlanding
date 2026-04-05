<template>
  <div class="relative">
    <!-- Main Feed Card -->
    <div class="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
      <!-- Header -->
      <div class="px-5 py-4 border-b border-border bg-secondary/30">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
            <span class="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Live Processing
            </span>
          </div>
          <span class="font-mono text-xs text-muted-foreground">
            {{ processedCount.toLocaleString() }} TTNs
          </span>
        </div>
      </div>

      <!-- TTN List -->
      <div class="h-80 overflow-hidden relative">
        <div class="absolute inset-0">
          <div
            v-for="(ttn, index) in ttns"
            :key="`${ttn.number}-${index}`"
            class="flex items-center justify-between px-5 py-3 border-b border-border/50 transition-all duration-500"
            :class="{ 'bg-primary/5': index === 0 }"
            :style="{ opacity: 1 - index * 0.08 }"
          >
            <code class="font-mono text-sm" :class="getStatusColor(ttn.status)">
              {{ ttn.number }}
            </code>
            <div class="flex items-center gap-2">
              <component :is="getStatusIcon(ttn.status)" class="w-3.5 h-3.5" :class="getStatusIconClass(ttn.status)" />
              <span class="text-xs font-medium capitalize" :class="getStatusColor(ttn.status)">
                {{ ttn.status }}
              </span>
            </div>
          </div>
        </div>

        <!-- Fade overlay -->
        <div class="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-card to-transparent pointer-events-none"></div>
      </div>
    </div>

    <!-- Floating Stats Card -->
    <div class="absolute -bottom-6 -right-4 bg-card border border-border rounded-xl shadow-lg px-4 py-3">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
          <ClockIcon class="w-5 h-5 text-accent" />
        </div>
        <div>
          <p class="text-xs text-muted-foreground">Time Saved</p>
          <p class="font-mono font-semibold text-foreground">{{ timeSaved }}min</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { CheckCircle2, AlertCircle, Clock as ClockIcon } from 'lucide-vue-next';

const generateTTN = () => {
  const prefix = '20450';
  const suffix = Math.floor(Math.random() * 900000000 + 100000000);
  return `${prefix}${suffix}`;
};

const statuses = ['processing', 'validated', 'duplicate'];

const ttns = ref(
  Array.from({ length: 12 }, () => ({
    number: generateTTN(),
    status: statuses[Math.floor(Math.random() * 3)],
  }))
);
const processedCount = ref(1247);
const timeSaved = ref(312);

let interval = null;

onMounted(() => {
  interval = setInterval(() => {
    const newTtn = { number: generateTTN(), status: 'processing' };
    const updated = [newTtn, ...ttns.value.slice(0, -1)];
    if (updated[1]) {
      updated[1] = {
        ...updated[1],
        status: Math.random() > 0.15 ? 'validated' : 'duplicate',
      };
    }
    ttns.value = updated;
    processedCount.value += 1;
    if (Math.random() > 0.5) timeSaved.value += 1;
  }, 1500);
});

onUnmounted(() => {
  if (interval) clearInterval(interval);
});

const getStatusColor = (status) => {
  switch (status) {
    case 'validated': return 'text-accent';
    case 'duplicate': return 'text-destructive';
    default: return 'text-muted-foreground';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'validated': return CheckCircle2;
    case 'duplicate': return AlertCircle;
    default: return ClockIcon;
  }
};

const getStatusIconClass = (status) => {
  switch (status) {
    case 'validated': return 'text-accent';
    case 'duplicate': return 'text-destructive';
    default: return 'text-muted-foreground animate-pulse';
  }
};
</script>
