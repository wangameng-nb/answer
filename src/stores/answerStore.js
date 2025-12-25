import { defineStore } from 'pinia'
import axios from 'axios'
import { useApiConfigStore } from './apiConfigStore'
import { useHistoryStore } from './historyStore'

export const useAnswerStore = defineStore('answers', {
  state: () => ({
    answers: {
      doubao: {
        status: 'waiting',
        content: '',
        timestamp: null,
        error: null
      },
      deepseek: {
        status: 'waiting',
        content: '',
        timestamp: null,
        error: null
      },
      tongyi: {
        status: 'waiting',
        content: '',
        timestamp: null,
        error: null
      },
      chatgpt: {
        status: 'waiting',
        content: '',
        timestamp: null,
        error: null
      }
    },
    currentQuestion: null
  }),

  actions: {
    async generateAllAnswers(question) {
      if (!question) return
      
      this.currentQuestion = question
      
      // 重置所有答案状态
      Object.keys(this.answers).forEach(provider => {
        this.answers[provider] = {
          status: 'processing',
          content: '',
          timestamp: null,
          error: null
        }
      })
      
      const apiConfigStore = useApiConfigStore()
      const historyStore = useHistoryStore()
      
      // 同时调用所有API
      const promises = Object.keys(this.answers).map(provider => 
        this.generateSingleAnswer(provider, question)
      )
      
      try {
        await Promise.all(promises)
        
        // 保存到历史记录
        const historyItem = {
          id: Date.now(),
          question: question,
          answers: Object.keys(this.answers).reduce((acc, provider) => {
            acc[provider] = this.answers[provider].content
            return acc
          }, {}),
          timestamp: Date.now()
        }
        
        historyStore.addHistoryItem(historyItem)
      } catch (error) {
        console.error('Error generating answers:', error)
      }
    },

    async generateSingleAnswer(provider, question) {
      if (!question) return
      
      const apiConfigStore = useApiConfigStore()
      const apiKey = apiConfigStore.config[`${provider}ApiKey`]
      
      // 检查API密钥
      if (!apiKey) {
        this.answers[provider] = {
          status: 'error',
          content: '',
          timestamp: null,
          error: 'API密钥未配置'
        }
        return
      }
      
      // 设置为处理中状态
      this.answers[provider] = {
        status: 'processing',
        content: '',
        timestamp: null,
        error: null
      }
      
      try {
        let response
        
        // 根据不同的AI服务调用相应的API
        switch (provider) {
          case 'doubao':
            response = await this.callDoubaoApi(apiKey, question)
            break
          case 'deepseek':
            response = await this.callDeepSeekApi(apiKey, question)
            break
          case 'tongyi':
            response = await this.callTongyiApi(apiKey, question)
            break
          case 'chatgpt':
            response = await this.callChatgptApi(apiKey, question)
            break
          default:
            throw new Error(`Unknown provider: ${provider}`)
        }
        
        // 更新答案状态
        this.answers[provider] = {
          status: 'completed',
          content: response,
          timestamp: Date.now(),
          error: null
        }
      } catch (error) {
        console.error(`Error calling ${provider} API:`, error)
        
        this.answers[provider] = {
          status: 'error',
          content: '',
          timestamp: null,
          error: error.message || 'API调用失败'
        }
      }
    },

    // 模拟答案生成函数，根据问题内容返回更精准的模拟答案
    generateMockAnswer(provider, question) {
      // 尝试从题目中提取选项和问题核心
      const optionPattern = /([A-D])\s*\.\s*([^\s]+(?:\s+[^\s]+)*)/g;
      const options = [];
      let match;
      
      while ((match = optionPattern.exec(question)) !== null) {
        options.push({
          letter: match[1],
          content: match[2]
        });
      }
      
      // 简单的题目分析和答案生成
      let answerLetter,解析;
      
      // 基于选项内容的更精准匹配
      if (options.length > 0) {
        // 检查每个选项的内容，尝试找出正确答案
        for (const option of options) {
          if (
            (option.content.includes('细胞膜') && option.content.includes('选择透过性')) ||
            (option.content.includes('DNA') && option.content.includes('主要遗传物质')) ||
            (option.content.includes('光合作用') && option.content.includes('叶绿体')) ||
            (option.content.includes('呼吸作用') && option.content.includes('线粒体')) ||
            (option.content.includes('酶') && option.content.includes('高效性'))
          ) {
            answerLetter = option.letter;
            break;
          }
        }
        
        // 如果没有找到明显的正确答案，基于问题核心选择
        if (!answerLetter) {
          if (question.includes('细胞结构')) {
            answerLetter = options.find(opt => opt.content.includes('细胞膜'))?.letter || 'A';
          } else if (question.includes('遗传')) {
            answerLetter = options.find(opt => opt.content.includes('DNA'))?.letter || 'B';
          } else if (question.includes('能量代谢')) {
            answerLetter = options.find(opt => opt.content.includes('叶绿体'))?.letter || 'C';
          } else {
            // 随机选择一个答案
            answerLetter = options[Math.floor(Math.random() * options.length)].letter;
          }
        }
        
        // 生成更相关的解析
        const questionCore = question.replace(optionPattern, '').trim();
        const correctOption = options.find(opt => opt.letter === answerLetter);
        const incorrectOptions = options.filter(opt => opt.letter !== answerLetter);
        
        解析 = `本题考查${questionCore}相关知识。选项${answerLetter}正确，因为${correctOption?.content}是该知识点的核心内容；`;
        
        incorrectOptions.forEach(opt => {
          解析 += `选项${opt.letter}错误，因为${opt.content}存在概念混淆或事实错误；`;
        });
        
        解析 = 解析.replace(/；$/, '') + '。';
      } else {
        // 没有找到选项的情况，返回默认答案
        answerLetter = 'A';
        解析 = '本题涉及生物学科知识，需根据题目内容分析各选项。选项A正确，其他选项存在错误。';
      }
      
      // 为不同提供商添加不同的风格
      const providerStyles = {
        'doubao': '根据豆包的专业分析，',
        'deepseek': 'DeepSeek的详细解析：',
        'tongyi': '通义千问的精准解读：',
        'chatgpt': 'ChatGPT的专业分析：'
      };
      
      return `**答案：** ${answerLetter}\n\n**解析：** ${providerStyles[provider]}${解析} 在生物竞赛中，准确理解基本概念和原理是解题的关键，需要深入掌握各知识点的内涵和外延。`;
    },
    
    // 豆包API调用
    async callDoubaoApi(apiKey, question) {
      try {
        // 真实豆包API调用
        const response = await axios({
          url: 'https://api.doubao.com/v1/chat/completions',
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          data: {
            model: 'doubao-pro',
            messages: [
              {
                role: 'system',
                content: '你是一名专业的生物竞赛辅导老师，请直接输出答案，并附带200字左右的详细解析。'
              },
              {
                role: 'user',
                content: question
              }
            ],
            temperature: 0.3
          }
        })
        
        return `**答案：** ${response.data.choices[0].message.content}`
      } catch (error) {
        console.error('豆包API调用错误:', error)
        throw new Error(`豆包API调用失败: ${error.response?.data?.error?.message || error.message}`)
      }
    },

    // DeepSeek API调用
    async callDeepSeekApi(apiKey, question) {
      try {
        // 真实DeepSeek API调用
        const response = await axios({
          url: 'https://api.deepseek.com/v1/chat/completions',
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          data: {
            model: 'deepseek-chat',
            messages: [
              {
                role: 'system',
                content: '你是一名专业的生物竞赛辅导老师，请直接输出答案，并附带200字左右的详细解析。'
              },
              {
                role: 'user',
                content: question
              }
            ],
            temperature: 0.3
          }
        })
        
        return `**答案：** ${response.data.choices[0].message.content}`
      } catch (error) {
        console.error('DeepSeek API调用错误:', error)
        throw new Error(`DeepSeek API调用失败: ${error.response?.data?.error?.message || error.message}`)
      }
    },

    // 通义千问API调用
    async callTongyiApi(apiKey, question) {
      try {
        // 真实通义千问API调用
        const response = await axios({
          url: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          data: {
            model: 'qwen-plus',
            input: {
              messages: [
                {
                  role: 'system',
                  content: '你是一名专业的生物竞赛辅导老师，请直接输出答案，并附带200字左右的详细解析。'
                },
                {
                  role: 'user',
                  content: question
                }
              ]
            },
            parameters: {
              temperature: 0.3
            }
          }
        })
        
        return `**答案：** ${response.data.output.text}`
      } catch (error) {
        console.error('通义千问API调用错误:', error)
        throw new Error(`通义千问API调用失败: ${error.response?.data?.error?.message || error.message}`)
      }
    },

    // ChatGPT API调用
    async callChatgptApi(apiKey, question) {
      try {
        // 真实ChatGPT API调用
        const response = await axios({
          url: 'https://api.openai.com/v1/chat/completions',
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          data: {
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: '你是一名专业的生物竞赛辅导老师，请直接输出答案，并附带200字左右的详细解析。'
              },
              {
                role: 'user',
                content: question
              }
            ],
            temperature: 0.3
          }
        })
        
        return `**答案：** ${response.data.choices[0].message.content}`
      } catch (error) {
        console.error('ChatGPT API调用错误:', error)
        throw new Error(`ChatGPT API调用失败: ${error.response?.data?.error?.message || error.message}`)
      }
    }
  }
})