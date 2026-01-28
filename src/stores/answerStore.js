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
      
      // 设置为处理中状态
      this.answers[provider] = {
        status: 'processing',
        content: '',
        timestamp: null,
        error: null
      }
      
      try {
        let response
        
        // 检查API密钥
        if (!apiKey) {
          throw new Error(`${provider} API密钥未配置`)
        }
        
        // 记录API调用开始
        console.log(`开始调用${provider} API...`)
        
        // 根据不同的AI服务调用相应的API
        switch (provider) {
          case 'doubao':
            console.log(`调用豆包API，URL: https://ark.cn-beijing.volces.com/api/v3/chat/completions`)
            response = await this.callDoubaoApi(apiKey, question)
            break
          case 'deepseek':
            console.log(`调用DeepSeek API，URL: https://api.deepseek.com/v1/chat/completions`)
            response = await this.callDeepSeekApi(apiKey, question)
            break
          case 'tongyi':
            console.log(`调用通义千问API，URL: https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation`)
            response = await this.callTongyiApi(apiKey, question)
            break
          case 'chatgpt':
            console.log(`调用ChatGPT API，URL: https://api.openai.com/v1/chat/completions`)
            response = await this.callChatgptApi(apiKey, question)
            break
          default:
            throw new Error(`未知的AI服务提供商: ${provider}`)
        }
        
        console.log(`${provider} API调用成功，返回结果:`, response)
        
        // 更新答案状态
        this.answers[provider] = {
          status: 'completed',
          content: response,
          timestamp: Date.now(),
          error: null
        }
      } catch (error) {
        console.error(`${provider} API调用失败详细信息:`, error)
        
        let errorMessage = `${provider} API调用失败`
        let errorStep = ''
        
        // 记录调用步骤
        if (error.message.includes('API密钥未配置')) {
          errorStep = '配置检查阶段'
          errorMessage = error.message
        } else if (error.response) {
          errorStep = 'API响应阶段'
          
          if (error.response.status === 401) {
            errorMessage = `${provider} API密钥验证失败，请检查API密钥是否正确`
          } else if (error.response.status === 403) {
            errorMessage = `${provider} API权限不足`
          } else if (error.response.status === 429) {
            errorMessage = `${provider} API请求频率过高，请稍后重试`
          } else if (error.response.status >= 500) {
            errorMessage = `${provider} API服务器错误`
          } else {
            errorMessage = `${provider} API返回错误状态码: ${error.response.status}`
          }
          
          // 添加API返回的具体错误信息
          if (error.response.data?.error?.message) {
            errorMessage += `: ${error.response.data.error.message}`
          } else if (error.response.data?.message) {
            errorMessage += `: ${error.response.data.message}`
          } else {
            errorMessage += `: ${JSON.stringify(error.response.data)}`
          }
        } else if (error.request) {
          errorStep = 'API请求阶段'
          errorMessage = `${provider} API无响应，请检查网络连接或API服务状态`
        } else {
          errorStep = '请求构建阶段'
          errorMessage = `${provider} API调用错误: ${error.message}`
        }
        
        // 添加失败步骤信息
        const detailedErrorMessage = `${errorMessage} (失败阶段: ${errorStep})`
        
        // 更新答案状态为错误
        this.answers[provider] = {
          status: 'error',
          content: '',
          timestamp: Date.now(),
          error: detailedErrorMessage
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
        // 更新豆包API端点
        const response = await axios({
          url: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
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
        console.log('开始构建通义千问API请求...')
        console.log('URL:', 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation')
        console.log('Headers:', {
          'Authorization': 'Bearer [REDACTED]',
          'Content-Type': 'application/json'
        })
        console.log('Request Body:', {
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
        })
        
        // 真实通义千问API调用
        console.log('发起通义千问API请求...')
        const response = await axios({
          url: '/api/tongyi',
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
        
        console.log('通义千问API请求成功，响应数据:', response.data)
        
        // 更新通义千问API响应解析
        let answerContent = ''
        if (response.data.output?.text) {
          answerContent = response.data.output.text
        } else if (response.data.output?.choices?.[0]?.message?.content) {
          answerContent = response.data.output.choices[0].message.content
        } else {
          answerContent = JSON.stringify(response.data.output)
        }
        
        return `**答案：** ${answerContent}`
      } catch (error) {
        console.error('通义千问API调用错误详情:', {
          message: error.message,
          name: error.name,
          stack: error.stack,
          response: error.response,
          request: error.request,
          config: error.config
        })
        
        let detailedError = ''
        if (error.response) {
          // 服务器返回了错误状态码
          detailedError = `服务器返回错误: ${error.response.status} - ${JSON.stringify(error.response.data)}`
        } else if (error.request) {
          // 请求已发送但没有收到响应
          detailedError = `没有收到服务器响应，请检查网络连接或API服务状态`
        } else {
          // 请求配置有误
          detailedError = `请求配置错误: ${error.message}`
        }
        
        throw new Error(`通义千问API调用失败: ${detailedError}`)
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