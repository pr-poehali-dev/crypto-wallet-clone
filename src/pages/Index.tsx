import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface Network {
  id: string;
  name: string;
  chainId: number;
  icon: string;
  color: string;
}

interface Token {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  change: number;
  icon: string;
  network: string;
  address?: string;
}

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'swap';
  token: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  network: string;
  hash?: string;
}

export default function Index() {
  const [activeTab, setActiveTab] = useState('wallet');
  const [selectedNetwork, setSelectedNetwork] = useState('all');
  const [seedPhrase, setSeedPhrase] = useState<string[]>([]);
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);

  const networks: Network[] = [
    { id: 'ethereum', name: 'Ethereum', chainId: 1, icon: 'Ξ', color: '#627EEA' },
    { id: 'bsc', name: 'BSC', chainId: 56, icon: '◆', color: '#F3BA2F' },
    { id: 'polygon', name: 'Polygon', chainId: 137, icon: '⬡', color: '#8247E5' },
    { id: 'avalanche', name: 'Avalanche', chainId: 43114, icon: '▲', color: '#E84142' },
    { id: 'arbitrum', name: 'Arbitrum', chainId: 42161, icon: '◉', color: '#28A0F0' },
  ];

  const tokens: Token[] = [
    { symbol: 'ETH', name: 'Ethereum', balance: 1.5432, value: 4329.60, change: 2.5, icon: 'Ξ', network: 'ethereum' },
    { symbol: 'USDT', name: 'Tether', balance: 5000, value: 5000, change: 0, icon: '₮', network: 'ethereum', address: '0xdac17f958d2ee523a2206206994597c13d831ec7' },
    { symbol: 'USDC', name: 'USD Coin', balance: 2500, value: 2500, change: 0.1, icon: '$', network: 'ethereum', address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' },
    { symbol: 'BNB', name: 'BNB', balance: 12.45, value: 7470, change: 3.8, icon: '◆', network: 'bsc' },
    { symbol: 'BUSD', name: 'Binance USD', balance: 3000, value: 3000, change: -0.1, icon: 'B', network: 'bsc', address: '0xe9e7cea3dedca5984780bafc599bd69add087d56' },
    { symbol: 'MATIC', name: 'Polygon', balance: 1500, value: 1350, change: 5.2, icon: '⬡', network: 'polygon' },
    { symbol: 'AVAX', name: 'Avalanche', balance: 45.2, value: 1808, change: -1.5, icon: '▲', network: 'avalanche' },
    { symbol: 'ARB', name: 'Arbitrum', balance: 800, value: 960, change: 8.3, icon: '◉', network: 'arbitrum' },
    { symbol: 'LINK', name: 'Chainlink', balance: 150, value: 2550, change: 4.1, icon: '⬢', network: 'ethereum', address: '0x514910771af9ca656af840dff83e8264ecf986ca' },
    { symbol: 'UNI', name: 'Uniswap', balance: 200, value: 2200, change: -2.3, icon: '🦄', network: 'ethereum', address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984' },
  ];

  const filteredTokens = selectedNetwork === 'all' 
    ? tokens 
    : tokens.filter(t => t.network === selectedNetwork);

  const totalBalance = filteredTokens.reduce((acc, token) => acc + token.value, 0);

  const transactions: Transaction[] = [
    { id: '1', type: 'receive', token: 'ETH', amount: 0.5, date: '2025-11-28 14:30', status: 'completed', network: 'ethereum', hash: '0x7a8b...' },
    { id: '2', type: 'send', token: 'USDT', amount: 1000, date: '2025-11-28 09:15', status: 'completed', network: 'ethereum', hash: '0x3c4d...' },
    { id: '3', type: 'swap', token: 'BNB → BUSD', amount: 5, date: '2025-11-27 18:45', status: 'completed', network: 'bsc', hash: '0x9e2f...' },
    { id: '4', type: 'receive', token: 'MATIC', amount: 500, date: '2025-11-27 12:00', status: 'pending', network: 'polygon' },
    { id: '5', type: 'send', token: 'AVAX', amount: 10, date: '2025-11-26 21:30', status: 'failed', network: 'avalanche' },
  ];

  const generateSeedPhrase = () => {
    const words = [
      'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 
      'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid'
    ];
    const newPhrase = Array.from({ length: 12 }, () => 
      words[Math.floor(Math.random() * words.length)]
    );
    setSeedPhrase(newPhrase);
    setShowSeedPhrase(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center brutal-shadow-sm">
                <Icon name="Wallet" size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Trust Vault</h1>
                <p className="text-sm text-muted-foreground">Multi-Chain Wallet</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Icon name="Scan" size={20} />
              </Button>
              <Button variant="outline" size="icon">
                <Icon name="Settings" size={20} />
              </Button>
            </div>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full bg-card border-2 border-border p-1">
            <TabsTrigger value="wallet" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Icon name="Wallet" size={18} className="mr-2" />
              Кошелек
            </TabsTrigger>
            <TabsTrigger value="swap" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Icon name="ArrowLeftRight" size={18} className="mr-2" />
              Обмен
            </TabsTrigger>
            <TabsTrigger value="send" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Icon name="Send" size={18} className="mr-2" />
              Отправить
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Icon name="Activity" size={18} className="mr-2" />
              Активность
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wallet" className="space-y-6">
            <Card className="brutal-card brutal-shadow p-6">
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-1">Общий баланс портфеля</p>
                <h2 className="text-5xl font-bold mb-3">
                  ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h2>
              </div>
              <div className="flex gap-3">
                <Button className="bg-primary text-white hover:bg-primary/90 flex-1">
                  <Icon name="Plus" size={18} className="mr-2" />
                  Купить
                </Button>
                <Button variant="outline" className="border-2 border-border flex-1">
                  <Icon name="ArrowUpRight" size={18} className="mr-2" />
                  Отправить
                </Button>
                <Button variant="outline" className="border-2 border-border flex-1">
                  <Icon name="Download" size={18} className="mr-2" />
                  Получить
                </Button>
              </div>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Активы</h3>
                <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
                  <SelectTrigger className="w-[180px] bg-card border-2 border-border">
                    <SelectValue placeholder="Все сети" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все сети</SelectItem>
                    {networks.map((network) => (
                      <SelectItem key={network.id} value={network.id}>
                        {network.icon} {network.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-3">
                {filteredTokens.map((token, idx) => {
                  const network = networks.find(n => n.id === token.network);
                  return (
                    <Card key={idx} className="brutal-card p-4 hover:border-primary transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-2xl font-bold border-2 border-border">
                            {token.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold">{token.symbol}</h4>
                              {network && (
                                <span 
                                  className="px-2 py-0.5 text-xs font-semibold rounded border-2"
                                  style={{ 
                                    borderColor: network.color,
                                    color: network.color
                                  }}
                                >
                                  {network.name}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{token.balance.toLocaleString()} {token.symbol}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${token.value.toLocaleString()}</p>
                          <p className={`text-sm ${token.change >= 0 ? 'text-accent' : 'text-destructive'}`}>
                            {token.change >= 0 ? '+' : ''}{token.change}%
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="swap" className="space-y-6">
            <Card className="brutal-card brutal-shadow p-6">
              <h3 className="text-xl font-bold mb-6">Обмен токенов</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Отдаете</label>
                  <div className="flex gap-2">
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      className="brutal-card border-2 border-border flex-1" 
                    />
                    <Select defaultValue="eth">
                      <SelectTrigger className="w-[140px] brutal-card border-2 border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="eth">Ξ ETH</SelectItem>
                        <SelectItem value="usdt">₮ USDT</SelectItem>
                        <SelectItem value="bnb">◆ BNB</SelectItem>
                        <SelectItem value="matic">⬡ MATIC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-xs text-muted-foreground">Доступно: 1.5432 ETH</p>
                </div>
                
                <div className="flex justify-center">
                  <Button size="icon" variant="outline" className="rounded-full border-2 border-border">
                    <Icon name="ArrowDownUp" size={20} />
                  </Button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Получаете</label>
                  <div className="flex gap-2">
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      className="brutal-card border-2 border-border flex-1" 
                    />
                    <Select defaultValue="usdt">
                      <SelectTrigger className="w-[140px] brutal-card border-2 border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usdt">₮ USDT</SelectItem>
                        <SelectItem value="eth">Ξ ETH</SelectItem>
                        <SelectItem value="bnb">◆ BNB</SelectItem>
                        <SelectItem value="usdc">$ USDC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Card className="brutal-card p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Курс</span>
                    <span className="font-medium">1 ETH = 2,805 USDT</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Комиссия сети</span>
                    <span className="font-medium">~$2.35</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Проскальзывание</span>
                    <span className="font-medium">0.5%</span>
                  </div>
                </Card>

                <Button className="w-full bg-primary text-white hover:bg-primary/90">
                  Обменять токены
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="send" className="space-y-6">
            <Card className="brutal-card brutal-shadow p-6">
              <h3 className="text-xl font-bold mb-6">Отправить токены</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Выберите токен</label>
                  <Select defaultValue="eth">
                    <SelectTrigger className="w-full brutal-card border-2 border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eth">Ξ Ethereum (ETH)</SelectItem>
                      <SelectItem value="usdt">₮ Tether (USDT)</SelectItem>
                      <SelectItem value="bnb">◆ BNB</SelectItem>
                      <SelectItem value="matic">⬡ Polygon (MATIC)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Адрес получателя</label>
                  <div className="relative">
                    <Input 
                      placeholder="0x..." 
                      className="brutal-card border-2 border-border pr-10"
                    />
                    <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2">
                      <Icon name="Scan" size={18} />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Сумма</label>
                    <span className="text-sm text-primary font-medium cursor-pointer">MAX</span>
                  </div>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    className="brutal-card border-2 border-border"
                  />
                  <p className="text-xs text-muted-foreground">Доступно: 1.5432 ETH ($4,329.60)</p>
                </div>

                <Card className="brutal-card p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Комиссия сети</span>
                    <span className="font-medium">~$1.85</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Время</span>
                    <span className="font-medium">~2-5 минут</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t-2 border-border">
                    <span>Итого</span>
                    <span>0.00 ETH</span>
                  </div>
                </Card>

                <Button className="w-full bg-primary text-white hover:bg-primary/90">
                  <Icon name="Send" size={18} className="mr-2" />
                  Отправить
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">История транзакций</h3>
                <Button variant="outline" size="sm" className="border-2 border-border">
                  <Icon name="Filter" size={16} className="mr-2" />
                  Фильтр
                </Button>
              </div>

              <div className="space-y-3">
                {transactions.map((tx) => {
                  const network = networks.find(n => n.id === tx.network);
                  return (
                    <Card key={tx.id} className="brutal-card p-4 hover:border-primary transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                            tx.type === 'receive' ? 'bg-accent/20 border-accent' :
                            tx.type === 'send' ? 'bg-destructive/20 border-destructive' :
                            'bg-primary/20 border-primary'
                          }`}>
                            <Icon 
                              name={tx.type === 'receive' ? 'ArrowDown' : tx.type === 'send' ? 'ArrowUp' : 'ArrowLeftRight'} 
                              size={20} 
                              className={
                                tx.type === 'receive' ? 'text-accent' :
                                tx.type === 'send' ? 'text-destructive' :
                                'text-primary'
                              }
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold">
                                {tx.type === 'receive' ? 'Получено' : tx.type === 'send' ? 'Отправлено' : 'Обмен'}
                              </h4>
                              {network && (
                                <span 
                                  className="px-2 py-0.5 text-xs font-semibold rounded border"
                                  style={{ 
                                    borderColor: network.color,
                                    color: network.color
                                  }}
                                >
                                  {network.name}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{tx.date}</p>
                            {tx.hash && (
                              <p className="text-xs text-muted-foreground font-mono">{tx.hash}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${
                            tx.type === 'receive' ? 'text-accent' : ''
                          }`}>
                            {tx.type === 'receive' ? '+' : '-'}{tx.amount} {tx.token}
                          </p>
                          <div className="flex items-center justify-end gap-2 mt-1">
                            {tx.status === 'completed' && (
                              <span className="text-xs font-semibold text-accent px-2 py-1 bg-accent/10 rounded border border-accent">
                                Успешно
                              </span>
                            )}
                            {tx.status === 'pending' && (
                              <span className="text-xs font-semibold text-muted-foreground px-2 py-1 bg-muted/10 rounded border border-muted">
                                В обработке
                              </span>
                            )}
                            {tx.status === 'failed' && (
                              <span className="text-xs font-semibold text-destructive px-2 py-1 bg-destructive/10 rounded border border-destructive">
                                Ошибка
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Card className="brutal-card brutal-shadow p-6 mt-8">
          <h3 className="text-xl font-bold mb-6">Управление кошельком</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-bold mb-2">Создать кошелек</h4>
                <p className="text-sm text-muted-foreground mb-4">Сгенерируйте новую seed-фразу из 12 слов</p>
                {!showSeedPhrase ? (
                  <Button 
                    onClick={generateSeedPhrase}
                    className="bg-primary text-white hover:bg-primary/90"
                  >
                    <Icon name="Key" size={18} className="mr-2" />
                    Создать seed-фразу
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      {seedPhrase.map((word, index) => (
                        <div key={index} className="brutal-card border-2 border-border p-2 text-center">
                          <span className="text-xs text-muted-foreground">{index + 1}.</span>
                          <span className="ml-1 text-sm font-mono font-semibold">{word}</span>
                        </div>
                      ))}
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full border-2 border-border"
                      onClick={() => navigator.clipboard.writeText(seedPhrase.join(' '))}
                    >
                      <Icon name="Copy" size={18} className="mr-2" />
                      Копировать
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-bold mb-2">Импорт кошелька</h4>
                <p className="text-sm text-muted-foreground mb-4">Восстановите доступ через seed-фразу</p>
                <div className="space-y-3">
                  <Input 
                    placeholder="Введите 12 слов через пробел..." 
                    className="brutal-card border-2 border-border"
                  />
                  <Button className="w-full bg-primary text-white hover:bg-primary/90">
                    <Icon name="Download" size={18} className="mr-2" />
                    Импортировать кошелек
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t-2 border-border">
            <h4 className="font-bold mb-4">Безопасность</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="brutal-card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="Fingerprint" size={24} className="text-primary" />
                  <span className="font-semibold">Биометрия</span>
                </div>
                <p className="text-xs text-muted-foreground">Touch ID / Face ID</p>
              </Card>
              <Card className="brutal-card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="Shield" size={24} className="text-accent" />
                  <span className="font-semibold">2FA защита</span>
                </div>
                <p className="text-xs text-muted-foreground">Двухфакторная аутентификация</p>
              </Card>
              <Card className="brutal-card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="Lock" size={24} className="text-destructive" />
                  <span className="font-semibold">Пин-код</span>
                </div>
                <p className="text-xs text-muted-foreground">6-значный код доступа</p>
              </Card>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
