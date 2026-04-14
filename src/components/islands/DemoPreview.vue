<template>
  <section id="demo" class="py-24 lg:py-32 bg-foreground relative overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute inset-0 grid-lines" style="background-size: calc(100% / 8) 100%"></div>
    </div>

    <div class="relative max-w-7xl mx-auto px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
        <span class="inline-block text-xs font-medium uppercase tracking-widest text-primary mb-4">
          Інтерактивне демо
        </span>
        <h2 class="text-3xl lg:text-4xl font-bold text-background leading-tight mb-4">
          Побач магію в дії
        </h2>
        <p class="text-lg text-background/60">
          Дивись як TTNFlow перетворює список ТТН на організовані реєстри.
        </p>
      </div>

      <!-- Demo Container -->
      <div class="bg-card rounded-3xl shadow-2xl overflow-hidden border border-border">
        <!-- Toolbar -->
        <div class="px-6 py-4 bg-secondary/50 border-b border-border flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="flex gap-1.5">
              <div class="w-3 h-3 rounded-full bg-destructive/60"></div>
              <div class="w-3 h-3 rounded-full bg-yellow-400/60"></div>
              <div class="w-3 h-3 rounded-full bg-accent/60"></div>
            </div>
            <span class="text-sm font-medium text-muted-foreground">TTNFlow Dashboard</span>
          </div>
          <div class="flex items-center gap-2">
            <button
              v-if="isProcessed"
              @click="handleReset"
              class="inline-flex items-center justify-center h-8 px-3 text-sm font-medium border border-border rounded-md bg-transparent hover:bg-secondary transition-colors text-foreground"
            >
              Скинути
            </button>
            <button
              v-else
              @click="handleProcess"
              :disabled="isProcessing"
              class="inline-flex items-center justify-center h-8 px-3 text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors gap-2 disabled:opacity-60"
            >
              <Sparkles class="w-4 h-4" :class="{ 'animate-pulse': isProcessing }" />
              {{ isProcessing ? 'Обробка...' : 'Обробити файл' }}
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="grid lg:grid-cols-3 min-h-[400px]">
          <!-- Input Panel -->
          <div class="p-6 border-r border-border">
            <div class="flex items-center gap-2 mb-4">
              <FileText class="w-4 h-4 text-muted-foreground" />
              <span class="text-xs font-medium uppercase tracking-wider text-muted-foreground">Вхідний файл</span>
            </div>
            <div class="bg-secondary/50 rounded-xl p-4 h-80 overflow-auto">
              <pre class="font-mono text-sm text-foreground whitespace-pre-wrap">{{ sampleInput }}</pre>
            </div>
          </div>

          <!-- Analysis Panel -->
          <div class="p-6 border-r border-border bg-secondary/20">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full" :class="isProcessed ? 'bg-accent' : 'bg-muted-foreground'"></div>
                <span class="text-xs font-medium uppercase tracking-wider text-muted-foreground">Аналіз</span>
              </div>
              <div v-if="isProcessed" class="flex gap-3 text-xs">
                <span class="text-accent">{{ uniqueCount }} унікальних</span>
                <span class="text-destructive">{{ duplicateCount }} дублікатів</span>
              </div>
            </div>
            <div class="space-y-2 h-80 overflow-auto">
              <template v-if="isProcessed">
                <div
                  v-for="(result, index) in analysisResults"
                  :key="index"
                  class="flex items-center justify-between p-3 rounded-lg animate-fade-in"
                  :class="result.status === 'duplicate' ? 'bg-destructive/10' : 'bg-accent/10'"
                  :style="{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }"
                >
                  <code class="font-mono text-sm">{{ result.ttn }}</code>
                  <div class="flex items-center gap-2">
                    <template v-if="result.status === 'duplicate'">
                      <AlertCircle class="w-3.5 h-3.5 text-destructive" />
                      <span class="text-xs text-destructive">Дублікат</span>
                    </template>
                    <template v-else>
                      <CheckCircle2 class="w-3.5 h-3.5 text-accent" />
                      <span class="text-xs text-accent">Унікальний</span>
                    </template>
                  </div>
                </div>
              </template>
              <div v-else class="h-full flex items-center justify-center text-muted-foreground text-sm">
                <div v-if="isProcessing" class="flex items-center gap-2">
                  <div class="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  Аналізую...
                </div>
                <span v-else>Натисни "Обробити файл" для аналізу</span>
              </div>
            </div>
          </div>

          <!-- Output Panel -->
          <div class="p-6">
            <div class="flex items-center gap-2 mb-4">
              <ArrowRight class="w-4 h-4 text-muted-foreground" />
              <span class="text-xs font-medium uppercase tracking-wider text-muted-foreground">Вихідні реєстри</span>
            </div>
            <div class="space-y-3 h-80 overflow-auto">
              <template v-if="isProcessed">
                <div
                  v-for="(registry, index) in registries"
                  :key="registry"
                  class="bg-secondary/50 rounded-xl p-4 animate-fade-in"
                  :style="{ animationDelay: `${300 + index * 100}ms`, animationFillMode: 'both' }"
                >
                  <div class="flex items-center justify-between mb-3">
                    <span class="font-mono font-semibold text-foreground">{{ registry }}</span>
                    <span class="text-xs text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                      {{ getRegistryTtns(registry).length }} TTNs
                    </span>
                  </div>
                  <div class="space-y-1">
                    <code
                      v-for="(t, i) in getRegistryTtns(registry)"
                      :key="i"
                      class="block font-mono text-xs text-muted-foreground"
                    >{{ t.ttn }}</code>
                  </div>
                </div>
              </template>
              <div v-else class="h-full flex flex-col items-center justify-center text-muted-foreground text-sm gap-4">
                <Upload class="w-12 h-12 text-border" />
                <span>Реєстри з'являться тут</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { CheckCircle2, AlertCircle, ArrowRight, Sparkles, FileText, Upload } from 'lucide-vue-next';

const sampleInput = `20450123456789
20450987654321
20450111222333
20450123456789
20450444555666
20450777888999
20450111222333
20450222333444`;

const analysisResults = [
  { ttn: '20450123456789', status: 'unique', registry: 'R-001' },
  { ttn: '20450987654321', status: 'unique', registry: 'R-001' },
  { ttn: '20450111222333', status: 'unique', registry: 'R-002' },
  { ttn: '20450123456789', status: 'duplicate', original: 'Line 1' },
  { ttn: '20450444555666', status: 'unique', registry: 'R-002' },
  { ttn: '20450777888999', status: 'unique', registry: 'R-003' },
  { ttn: '20450111222333', status: 'duplicate', original: 'Line 3' },
  { ttn: '20450222333444', status: 'unique', registry: 'R-003' },
];

const registries = ['R-001', 'R-002', 'R-003'];

const isProcessing = ref(false);
const isProcessed = ref(false);

const uniqueCount = computed(() => analysisResults.filter((r) => r.status === 'unique').length);
const duplicateCount = computed(() => analysisResults.filter((r) => r.status === 'duplicate').length);

const getRegistryTtns = (registry) => analysisResults.filter((r) => r.registry === registry);

const handleProcess = () => {
  isProcessing.value = true;
  setTimeout(() => {
    isProcessing.value = false;
    isProcessed.value = true;
  }, 1500);
};

const handleReset = () => {
  isProcessed.value = false;
};
</script>
