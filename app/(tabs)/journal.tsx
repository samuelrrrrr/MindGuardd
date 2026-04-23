import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "../../components/Icon";
import { C } from "../../constants/Colors";

// GANTI DENGAN API KEY OPENAI MILIKMU
const OPENAI_API_KEY =
  "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";

type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
};

const INITIAL_MESSAGE: Message = {
  id: "init-1",
  role: "assistant",
  content:
    "Hi Sarah ✨ I'm MindGuard, your personal AI companion. Feel free to vent, complain, or share whatever is on your mind. I'm here to listen without judgment.",
};

export default function JournalChatScreen() {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputText.trim(),
    };

    const newMessages = [...messages, newUserMsg];
    setMessages(newMessages);
    setInputText("");
    setIsTyping(true);

    if (!OPENAI_API_KEY) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            content:
              "[API Key belum disetel] Silakan masukkan OPENAI_API_KEY di file journal.tsx untuk mendapatkan balasan AI sungguhan.",
          },
        ]);
        setIsTyping(false);
      }, 1500);
      return;
    }

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "You are MindGuard, a highly empathetic and supportive AI mental health companion. Your job is to actively listen, validate the user's feelings, and provide gentle, conversational support when they complain or vent. Keep your answers relatively short, warm, and natural.",
              },
              ...newMessages.map((m) => ({ role: m.role, content: m.content })),
            ],
          }),
        },
      );

      const data = await response.json();

      if (data.choices && data.choices.length > 0) {
        const botReply = data.choices[0].message.content;
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), role: "assistant", content: botReply },
        ]);
      } else {
        throw new Error("No valid response from OpenAI");
      }
    } catch (error) {
      console.error("Error fetching OpenAI response:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content:
            "Maaf, terjadi kesalahan saat menyambungkan ke server AI. Coba lagi nanti.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === "user";
    return (
      <View
        style={[
          styles.msgWrapper,
          isUser ? styles.msgWrapperRight : styles.msgWrapperLeft,
        ]}
      >
        {!isUser && (
          <Image
            source={{ uri: "https://i.pravatar.cc/100?img=5" }}
            style={styles.botAvatar}
          />
        )}
        <View
          style={[styles.msgBubble, isUser ? styles.msgUser : styles.msgBot]}
        >
          <Text
            style={[
              styles.msgText,
              isUser ? styles.msgTextUser : styles.msgTextBot,
            ]}
          >
            {item.content}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
      {/* HEADER */}
      <LinearGradient
        colors={[C.navyDeep, C.navy]}
        style={[styles.header, { paddingTop: insets.top + 10 }]}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerAvatarContainer}>
            <Image
              source={{ uri: "https://i.pravatar.cc/100?img=5" }}
              style={styles.headerAvatar}
            />
            <View style={styles.onlineDot} />
          </View>
          <View>
            <Text style={styles.headerTitle}>MindGuard AI</Text>
            <Text style={styles.headerSub}>Always here to listen</Text>
          </View>
        </View>
      </LinearGradient>

      {/* CHAT LIST */}
      <FlatList
        ref={flatListRef}
        data={messages.filter((m) => m.role !== "system")}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* TYPING INDICATOR */}
      {isTyping && (
        <View style={styles.typingContainer}>
          <Image
            source={{ uri: "https://i.pravatar.cc/100?img=5" }}
            style={styles.botAvatar}
          />
          <View
            style={[
              styles.msgBubble,
              styles.msgBot,
              { paddingVertical: 12, paddingHorizontal: 16 },
            ]}
          >
            <ActivityIndicator size="small" color={C.purple} />
          </View>
        </View>
      )}

      {/* INPUT AREA */}
      <View
        style={[styles.inputContainer, { paddingBottom: insets.bottom || 12 }]}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Ceritakan apa yang kamu rasakan..."
            placeholderTextColor={C.muted}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendBtn, !inputText.trim() && { opacity: 0.5 }]}
            onPress={handleSend}
            disabled={!inputText.trim() || isTyping}
          >
            <Icon n="send" s={16} c="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  header: {
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerAvatarContainer: {
    position: "relative",
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
  },
  onlineDot: {
    position: "absolute",
    bottom: 0,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: C.mint,
    borderWidth: 2,
    borderColor: C.navy,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
  },
  headerSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginTop: 2,
  },

  listContent: {
    padding: 16,
    paddingTop: 24,
    gap: 16,
  },
  msgWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 4,
  },
  msgWrapperLeft: {
    justifyContent: "flex-start",
  },
  msgWrapperRight: {
    justifyContent: "flex-end",
  },
  botAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  msgBubble: {
    maxWidth: "75%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  msgBot: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
    shadowColor: "#12175e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  msgUser: {
    backgroundColor: C.purple,
    borderBottomRightRadius: 4,
  },
  msgText: {
    fontSize: 14,
    lineHeight: 22,
  },
  msgTextBot: {
    color: C.text,
  },
  msgTextUser: {
    color: "#fff",
  },

  typingContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  inputContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: C.bg,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: "#12175e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },
  input: {
    flex: 1,
    maxHeight: 100,
    fontSize: 14,
    color: C.text,
    paddingTop: 8,
    paddingBottom: 8,
    marginRight: 10,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.purple,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
});
