import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface Network {
  id: string;
  name: string;
  chainId: number;
  icon: string;
  color: string;
}

interface WalletAddress {
  network: string;
  address: string;
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
  const { toast } = useToast();
  const [hasWallet, setHasWallet] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState<'welcome' | 'create' | 'import' | 'seedphrase' | 'verify'>('welcome');
  const [activeTab, setActiveTab] = useState('wallet');
  const [selectedNetwork, setSelectedNetwork] = useState('all');
  const [seedPhrase, setSeedPhrase] = useState<string[]>([]);
  const [walletAddresses, setWalletAddresses] = useState<WalletAddress[]>([]);
  const [showReceiveDialog, setShowReceiveDialog] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [sendAmount, setSendAmount] = useState('');
  const [sendAddress, setSendAddress] = useState('');

  const networks: Network[] = [
    { id: 'ethereum', name: 'Ethereum', chainId: 1, icon: 'Ξ', color: '#627EEA' },
    { id: 'bsc', name: 'BSC', chainId: 56, icon: '◆', color: '#F3BA2F' },
    { id: 'polygon', name: 'Polygon', chainId: 137, icon: '⬡', color: '#8247E5' },
    { id: 'avalanche', name: 'Avalanche', chainId: 43114, icon: '▲', color: '#E84142' },
    { id: 'arbitrum', name: 'Arbitrum', chainId: 42161, icon: '◉', color: '#28A0F0' },
  ];

  const [tokens, setTokens] = useState<Token[]>([
    { symbol: 'ETH', name: 'Ethereum', balance: 0, value: 0, change: 2.5, icon: 'Ξ', network: 'ethereum' },
    { symbol: 'USDT', name: 'Tether', balance: 0, value: 0, change: 0, icon: '₮', network: 'ethereum', address: '0xdac17f958d2ee523a2206206994597c13d831ec7' },
    { symbol: 'USDC', name: 'USD Coin', balance: 0, value: 0, change: 0.1, icon: '$', network: 'ethereum', address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' },
    { symbol: 'BNB', name: 'BNB', balance: 0, value: 0, change: 3.8, icon: '◆', network: 'bsc' },
    { symbol: 'BUSD', name: 'Binance USD', balance: 0, value: 0, change: -0.1, icon: 'B', network: 'bsc', address: '0xe9e7cea3dedca5984780bafc599bd69add087d56' },
    { symbol: 'MATIC', name: 'Polygon', balance: 0, value: 0, change: 5.2, icon: '⬡', network: 'polygon' },
    { symbol: 'AVAX', name: 'Avalanche', balance: 0, value: 0, change: -1.5, icon: '▲', network: 'avalanche' },
    { symbol: 'ARB', name: 'Arbitrum', balance: 0, value: 0, change: 8.3, icon: '◉', network: 'arbitrum' },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const savedWallet = localStorage.getItem('wallet');
    if (savedWallet) {
      const walletData = JSON.parse(savedWallet);
      setHasWallet(true);
      setShowOnboarding(false);
      setSeedPhrase(walletData.seedPhrase);
      setWalletAddresses(walletData.addresses);
    }
  }, []);

  const generateAddress = (network: string): string => {
    const chars = '0123456789abcdef';
    let address = '0x';
    for (let i = 0; i < 40; i++) {
      address += chars[Math.floor(Math.random() * chars.length)];
    }
    return address;
  };

  const generateSeedPhrase = () => {
    const words = [
      'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 
      'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid',
      'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actress', 'actual'
    ];
    const newPhrase = Array.from({ length: 12 }, () => 
      words[Math.floor(Math.random() * words.length)]
    );
    setSeedPhrase(newPhrase);
    setOnboardingStep('seedphrase');
  };

  const createWallet = () => {
    const addresses: WalletAddress[] = networks.map(network => ({
      network: network.id,
      address: generateAddress(network.id)
    }));
    
    setWalletAddresses(addresses);
    
    const walletData = {
      seedPhrase,
      addresses,
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('wallet', JSON.stringify(walletData));
    setHasWallet(true);
    setShowOnboarding(false);
    
    toast({
      title: "Кошелек создан!",
      description: "Ваш кошелек успешно создан и защищен",
    });
  };

  const copySeedPhrase = () => {
    navigator.clipboard.writeText(seedPhrase.join(' '));
    toast({
      title: "Скопировано!",
      description: "Seed-фраза скопирована в буфер обмена",
    });
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Адрес скопирован!",
      description: address,
    });
  };

  const handleReceive = (token: Token) => {
    setSelectedToken(token);
    setShowReceiveDialog(true);
  };

  const handleSend = (token: Token) => {
    setSelectedToken(token);
    setShowSendDialog(true);
  };

  const executeSend = () => {
    if (!sendAddress || !sendAmount || !selectedToken) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive"
      });
      return;
    }

    const newTx: Transaction = {
      id: Date.now().toString(),
      type: 'send',
      token: selectedToken.symbol,
      amount: parseFloat(sendAmount),
      date: new Date().toLocaleString('ru-RU'),
      status: 'pending',
      network: selectedToken.network,
      hash: '0x' + Math.random().toString(16).slice(2, 10)
    };

    setTransactions([newTx, ...transactions]);
    
    setTimeout(() => {
      setTransactions(prev => 
        prev.map(tx => tx.id === newTx.id ? { ...tx, status: 'completed' } : tx)
      );
      
      setTokens(prev => 
        prev.map(t => 
          t.symbol === selectedToken.symbol 
            ? { ...t, balance: t.balance - parseFloat(sendAmount), value: (t.balance - parseFloat(sendAmount)) * (t.value / t.balance || 0) }
            : t
        )
      );
    }, 3000);

    setShowSendDialog(false);
    setSendAmount('');
    setSendAddress('');
    
    toast({
      title: "Транзакция отправлена",
      description: `Отправка ${sendAmount} ${selectedToken.symbol}`,
    });
  };

  const filteredTokens = selectedNetwork === 'all' 
    ? tokens 
    : tokens.filter(t => t.network === selectedNetwork);

  const totalBalance = filteredTokens.reduce((acc, token) => acc + token.value, 0);

  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="brutal-card brutal-shadow w-full max-w-md p-8">
          {onboardingStep === 'welcome' && (
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-primary flex items-center justify-center">
                <Icon name="Wallet" size={40} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Trust Vault</h1>
                <p className="text-muted-foreground">Мультичейн криптовалютный кошелек</p>
              </div>
              <div className="space-y-3 pt-4">
                <Button 
                  className="w-full bg-primary text-white hover:bg-primary/90"
                  onClick={() => setOnboardingStep('create')}
                >
                  Создать новый кошелек
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-2 border-border"
                  onClick={() => setOnboardingStep('import')}
                >
                  У меня уже есть кошелек
                </Button>
              </div>
            </div>
          )}

          {onboardingStep === 'create' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Icon name="Lock" size={32} className="text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Безопасность превыше всего</h2>
                <p className="text-sm text-muted-foreground">
                  Мы создадим для вас уникальную seed-фразу из 12 слов. 
                  Это ключ к вашему кошельку - храните её в безопасности!
                </p>
              </div>
              <div className="space-y-3">
                <Button 
                  className="w-full bg-primary text-white hover:bg-primary/90"
                  onClick={generateSeedPhrase}
                >
                  Создать seed-фразу
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-2 border-border"
                  onClick={() => setOnboardingStep('welcome')}
                >
                  Назад
                </Button>
              </div>
            </div>
          )}

          {onboardingStep === 'seedphrase' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Ваша seed-фраза</h2>
                <p className="text-sm text-muted-foreground">
                  Запишите эти 12 слов в правильном порядке и храните в безопасном месте
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {seedPhrase.map((word, index) => (
                  <div key={index} className="brutal-card border-2 border-border p-3 text-center">
                    <div className="text-xs text-muted-foreground mb-1">{index + 1}</div>
                    <div className="text-sm font-bold font-mono">{word}</div>
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="w-full border-2 border-border"
                onClick={copySeedPhrase}
              >
                <Icon name="Copy" size={18} className="mr-2" />
                Копировать фразу
              </Button>
              <div className="space-y-3">
                <Button 
                  className="w-full bg-primary text-white hover:bg-primary/90"
                  onClick={createWallet}
                >
                  Я сохранил(а) seed-фразу
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-2 border-border"
                  onClick={() => setOnboardingStep('create')}
                >
                  Назад
                </Button>
              </div>
            </div>
          )}

          {onboardingStep === 'import' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Импорт кошелька</h2>
                <p className="text-sm text-muted-foreground">
                  Введите вашу seed-фразу из 12 слов
                </p>
              </div>
              <div className="space-y-3">
                <Input 
                  placeholder="Введите 12 слов через пробел..."
                  className="brutal-card border-2 border-border"
                />
                <Button 
                  className="w-full bg-primary text-white hover:bg-primary/90"
                >
                  Импортировать кошелек
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-2 border-border"
                  onClick={() => setOnboardingStep('welcome')}
                >
                  Назад
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    );
  }

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
            <TabsTrigger value="addresses" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Icon name="Globe" size={18} className="mr-2" />
              Адреса
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
                <Button 
                  variant="outline" 
                  className="border-2 border-border flex-1"
                  onClick={() => {
                    if (filteredTokens.length > 0) {
                      handleSend(filteredTokens[0]);
                    }
                  }}
                >
                  <Icon name="ArrowUpRight" size={18} className="mr-2" />
                  Отправить
                </Button>
                <Button 
                  variant="outline" 
                  className="border-2 border-border flex-1"
                  onClick={() => {
                    if (filteredTokens.length > 0) {
                      handleReceive(filteredTokens[0]);
                    }
                  }}
                >
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
                          <div className="flex gap-2 mt-1">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="h-7 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReceive(token);
                              }}
                            >
                              Получить
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="h-7 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSend(token);
                              }}
                            >
                              Отправить
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="addresses" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Адреса кошелька</h3>
              <p className="text-sm text-muted-foreground">
                Ваши уникальные адреса для каждой сети
              </p>

              <div className="grid gap-4">
                {networks.map((network) => {
                  const walletAddr = walletAddresses.find(wa => wa.network === network.id);
                  return (
                    <Card key={network.id} className="brutal-card p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold border-2"
                            style={{ borderColor: network.color, color: network.color }}
                          >
                            {network.icon}
                          </div>
                          <div>
                            <h4 className="font-bold">{network.name}</h4>
                            <p className="text-xs text-muted-foreground">Chain ID: {network.chainId}</p>
                          </div>
                        </div>
                      </div>
                      {walletAddr && (
                        <div className="space-y-2">
                          <div className="brutal-card border-2 border-border p-3 rounded">
                            <p className="text-xs text-muted-foreground mb-1">Адрес</p>
                            <p className="font-mono text-sm break-all">{walletAddr.address}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex-1 border-2 border-border"
                              onClick={() => copyAddress(walletAddr.address)}
                            >
                              <Icon name="Copy" size={16} className="mr-2" />
                              Копировать
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex-1 border-2 border-border"
                            >
                              <Icon name="QrCode" size={16} className="mr-2" />
                              QR-код
                            </Button>
                          </div>
                        </div>
                      )}
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
                      </SelectContent>
                    </Select>
                  </div>
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
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button className="w-full bg-primary text-white hover:bg-primary/90">
                  Обменять токены
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">История транзакций</h3>
              
              {transactions.length === 0 ? (
                <Card className="brutal-card p-12 text-center">
                  <Icon name="Inbox" size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Пока нет транзакций</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {transactions.map((tx) => {
                    const network = networks.find(n => n.id === tx.network);
                    return (
                      <Card key={tx.id} className="brutal-card p-4">
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
                              <h4 className="font-bold">
                                {tx.type === 'receive' ? 'Получено' : tx.type === 'send' ? 'Отправлено' : 'Обмен'}
                              </h4>
                              <p className="text-sm text-muted-foreground">{tx.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">
                              {tx.type === 'receive' ? '+' : '-'}{tx.amount} {tx.token}
                            </p>
                            <span className={`text-xs font-semibold px-2 py-1 rounded border ${
                              tx.status === 'completed' ? 'text-accent border-accent bg-accent/10' :
                              tx.status === 'pending' ? 'text-muted-foreground border-muted bg-muted/10' :
                              'text-destructive border-destructive bg-destructive/10'
                            }`}>
                              {tx.status === 'completed' ? 'Успешно' : tx.status === 'pending' ? 'В обработке' : 'Ошибка'}
                            </span>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showReceiveDialog} onOpenChange={setShowReceiveDialog}>
        <DialogContent className="brutal-card">
          <DialogHeader>
            <DialogTitle>Получить {selectedToken?.symbol}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="text-center">
              <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center mb-4">
                <p className="text-xs text-black">QR Code</p>
              </div>
              {selectedToken && walletAddresses.find(wa => wa.network === selectedToken.network) && (
                <div className="brutal-card border-2 border-border p-4 rounded">
                  <p className="text-xs text-muted-foreground mb-2">Ваш адрес</p>
                  <p className="font-mono text-sm break-all">
                    {walletAddresses.find(wa => wa.network === selectedToken.network)?.address}
                  </p>
                </div>
              )}
            </div>
            <Button 
              className="w-full border-2 border-border" 
              variant="outline"
              onClick={() => {
                const addr = walletAddresses.find(wa => wa.network === selectedToken?.network);
                if (addr) copyAddress(addr.address);
              }}
            >
              <Icon name="Copy" size={18} className="mr-2" />
              Копировать адрес
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
        <DialogContent className="brutal-card">
          <DialogHeader>
            <DialogTitle>Отправить {selectedToken?.symbol}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Адрес получателя</label>
              <Input 
                placeholder="0x..."
                value={sendAddress}
                onChange={(e) => setSendAddress(e.target.value)}
                className="brutal-card border-2 border-border"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Сумма</label>
              <Input 
                type="number"
                placeholder="0.00"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                className="brutal-card border-2 border-border"
              />
              <p className="text-xs text-muted-foreground">
                Доступно: {selectedToken?.balance} {selectedToken?.symbol}
              </p>
            </div>
            <Button 
              className="w-full bg-primary text-white hover:bg-primary/90"
              onClick={executeSend}
            >
              Отправить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
