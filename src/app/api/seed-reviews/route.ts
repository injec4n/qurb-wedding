import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const reviews = [
      { type: 'text', name: 'أحمد محمد', rating: 5, text: 'الدعوة كانت تحفة فنية! كل الضيوف اتصلوا بي يسألوا مين عمل التصميم ده. شكراً قُرب على الإبداع!', weddingName: 'زفاف أحمد ونورة', isActive: true, order: 1 },
      { type: 'text', name: 'سارة العمري', rating: 5, text: 'تجربة متميزة من أول لحظة! التصميم الفاخر والاهتمام بكل تفصيلة خلّى دعوتنا تكون الأجمل بين كل أصحابنا.', weddingName: 'زفاف خالد وسارة', isActive: true, order: 2 },
      { type: 'text', name: 'محمد حسين', rating: 5, text: 'أحسن قرار أخدته إنني استخدمت قُرب. الدعوة الرقمية وفرت عليا وقت ومصاريف كتير والنتيجة كانت فوق التوقع!', weddingName: 'زفاف محمد وفاطمة', isActive: true, order: 3 },
      { type: 'text', name: 'ريم الأحمد', rating: 5, text: 'حقيقي تجربة مختلفة تماماً! الضيوف لما فتحوا الرابط بتاعهم باسمهم كانوا مبسوطين جداً. لمسة شخصية رائعة!', weddingName: 'زفاف عمر وريم', isActive: true, order: 4 },
      { type: 'text', name: 'ياسر عبدالله', rating: 5, text: 'الموسيقى والتصميم السينمائي خلّوا الدعوة تحس كأنها فيلم. كل من شافها قال ماشاء الله. ربنا يبارك فيكم!', weddingName: 'زفاف ياسر وهند', isActive: true, order: 5 },
    ];

    const results: string[] = [];
    for (const r of reviews) {
      const existing = await db.review.findFirst({ where: { name: r.name } });
      if (!existing) {
        await db.review.create({ data: r });
        results.push('تم إضافة: ' + r.name);
      } else {
        results.push('موجود: ' + r.name);
      }
    }

    const total = await db.review.count();
    return NextResponse.json({ success: true, message: 'إجمالي التقييمات: ' + total, details: results });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}